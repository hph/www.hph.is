import React, { Fragment } from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import Loadable from 'react-loadable';
import { extractCritical } from 'emotion-server';
import { getBundles } from 'react-loadable/webpack';
import url from 'url';
import fs from 'fs';

import log from './logger';
import buildStats from '../../build/react-loadable.json';
import App from '../components/app';
import Head from '../components/head';
import {
  rootContainerId,
  hydrationFunctionName,
  pageViewTrackingFunctionName,
} from '../constants';

const isProd = process.env.NODE_ENV === 'production';

// Get the filenames of the built assets (including their hashes).
const { runtime, vendor, client } = preval.require('./get-main-assets'); // eslint-disable-line no-undef

// The runtime script is quite small at around 1 KB, so we can inline it
// to keep the number of requests smaller.
const runtimeVendorScripts = isProd && (
  <Fragment>
    <script
      dangerouslySetInnerHTML={{
        __html: fs.readFileSync(`./build/${runtime}`, { encoding: 'utf-8' }),
      }}
    />
    <script src={`/${vendor}`} />
  </Fragment>
);

// Track both the initial page view and page changes via Google Analytics.
const googleAnalyticsScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-50640007-2');
window.${pageViewTrackingFunctionName} = function (url) {
  gtag('config', 'UA-50640007-2', {page_path: url});
}
`.replace(/\n/g, '');
const analyticsScripts = (
  <Fragment>
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=UA-50640007-2"
    />
    <script dangerouslySetInnerHTML={{ __html: googleAnalyticsScript }} />
  </Fragment>
);

function getCodeSplitScripts(stats, modules) {
  return getBundles(stats, modules).map(bundle => bundle && bundle.file);
}

// Fade the page in. Makes for a smoother experience for visitors that do not
// have the font on first page load. Subsequent page views do not fade in,
// including when refreshing the page (relies on a cookie).
const fadeCss =
  'body{animation:fadeIn 1s ease}@keyframes fadeIn{from{opacity:0}to{opacity:1}}';

function renderPageContents({
  html,
  css,
  ids,
  head,
  codeSplitScripts,
  firstVisit,
}) {
  const injectedCss = firstVisit ? fadeCss + css : css;
  const rehydrate = `window.${hydrationFunctionName}(${JSON.stringify(ids)});`;
  const markup = renderToStaticMarkup(
    <html lang="en">
      <head>
        {head.map(({ tag: HeadComponent, ...props }, index) => (
          <HeadComponent {...props} key={index} />
        ))}
        <meta charSet="utf-8" />
        <meta name="author" content="Haukur Páll Hallvarðsson" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{injectedCss}</style>
        {isProd && analyticsScripts}
      </head>
      <body>
        <div id={rootContainerId} dangerouslySetInnerHTML={{ __html: html }} />
        {isProd && runtimeVendorScripts}
        <script src={`/${client}`} />
        {codeSplitScripts.map(script => (
          <script src={`/${script}`} key={script} />
        ))}
        <script dangerouslySetInnerHTML={{ __html: rehydrate }} />
      </body>
    </html>,
  );
  return `<!doctype html>${markup}`;
}

const memCache = new Map();
const cacheKey = ({ firstVisit, path }) => `${firstVisit ? 'f' : 'nf'}${path}`;

export default function renderPage(req, res) {
  const firstVisit = !req.cookies.visited;
  if (firstVisit) {
    const oneYearInSeconds = 60 * 24 * 365;
    res.cookie('visited', 't', {
      maxAge: new Date(Date.now() + oneYearInSeconds),
    });
  }

  const path = url.parse(req.originalUrl).pathname;
  log.info({ path }, 'Rendering page');
  const cachedPage = memCache.get(cacheKey({ firstVisit, path }));
  if (cachedPage) {
    log.info({ path }, 'Serving page from cache');
    return res.status(200).send(cachedPage);
  }

  log.info({ path }, 'Rendering application to string');
  const reactRouter = {};
  const modules = [];
  const { html, css, ids } = extractCritical(
    renderToString(
      <Loadable.Capture report={moduleName => modules.push(moduleName)}>
        <StaticRouter location={req.url} context={reactRouter}>
          <App />
        </StaticRouter>
      </Loadable.Capture>,
    ),
  );
  log.info({ path }, 'Application rendered');

  if (reactRouter.url) {
    log.info({ path, redirectUrl: reactRouter.url }, 'Redirecting to');
    res.redirect(reactRouter.url);
  } else {
    log.info(
      { path },
      'Constructing a full document from the rendered application',
    );
    const page = renderPageContents({
      html,
      css,
      ids,
      head: Head.flush(),
      codeSplitScripts: getCodeSplitScripts(buildStats, modules),
      firstVisit,
    });

    const statusCode = reactRouter.status || 200;
    if (statusCode === 200) {
      log.info({ path }, 'Caching page');
      memCache.set(cacheKey({ firstVisit, path }), page);
    }

    log.info({ path }, 'Serving page');
    res.status(statusCode).send(page);
  }
}
