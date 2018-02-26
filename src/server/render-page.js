import React, { Fragment } from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import Loadable from 'react-loadable';
import { extractCritical } from 'emotion-server';
import { getBundles } from 'react-loadable/webpack';
import fs from 'fs';

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

function renderPageContents({ html, css, ids, head, codeSplitScripts }) {
  const rehydrate = `window.${hydrationFunctionName}(${JSON.stringify(ids)});`;
  return renderToStaticMarkup(
    <html lang="en">
      <head>
        {head.map(({ tag: HeadComponent, ...props }, index) => (
          <HeadComponent {...props} key={index} />
        ))}
        <meta charSet="utf-8" />
        <meta name="author" content="Haukur Páll Hallvarðsson" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css?family=Source+Sans+Pro"
          rel="stylesheet"
        />
        <style>{css}</style>
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
}

export default function renderPage(req, res) {
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
  if (reactRouter.url) {
    res.redirect(reactRouter.url);
  } else {
    const page = renderPageContents({
      html,
      css,
      ids,
      head: Head.flush(),
      codeSplitScripts: getCodeSplitScripts(buildStats, modules),
    });
    const statusCode = reactRouter.status || 200;
    res.status(statusCode).send(`<!doctype html>${page}`);
  }
}
