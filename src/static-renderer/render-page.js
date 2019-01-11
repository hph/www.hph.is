import React, { Fragment } from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { ServerLocation } from '@reach/router';
import { extractCritical } from 'emotion-server';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import fs from 'fs';
import path from 'path';
import CleanCSS from 'clean-css';

import buildStats from '../../build/react-loadable.json';
import App from '../components/app';
import Head from '../components/head';
import { rootContainerId, pageViewTrackingFunctionName } from '../constants';
import { profilePictureUrl } from '../components/about';

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

const fontsRaw = fs.readFileSync(
  path.resolve(process.cwd(), 'src/static-renderer/fonts.css'),
  {
    encoding: 'utf-8',
  },
);
const fonts = new CleanCSS().minify(fontsRaw).styles;

function getCodeSplitScripts(stats, modules) {
  return getBundles(stats, modules).map(bundle => bundle && bundle.file);
}

function renderPageContents({ html, css, head, codeSplitScripts }) {
  const markup = renderToStaticMarkup(
    <html lang="en">
      <head>
        {head.map(({ tag: HeadComponent, ...props }, index) => (
          <HeadComponent {...props} key={index} />
        ))}
        <meta charSet="utf-8" />
        <meta name="author" content="Haukur Páll Hallvarðsson" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <style dangerouslySetInnerHTML={{ __html: fonts + css }} />
        <link
          rel="preload"
          as="image"
          href={profilePictureUrl}
          media="(min-width: 1260px)"
        />
        {isProd && analyticsScripts}
      </head>
      <body>
        <div id={rootContainerId} dangerouslySetInnerHTML={{ __html: html }} />
        {isProd && runtimeVendorScripts}
        <script src={`/${client}`} />
        {codeSplitScripts.map(script => (
          <script src={`/${script}`} key={script} />
        ))}
      </body>
    </html>,
  );
  return `<!doctype html>${markup}`;
}

export function renderPage(path) {
  const modules = [];

  const { html, css } = extractCritical(
    renderToString(
      <Loadable.Capture report={moduleName => modules.push(moduleName)}>
        <ServerLocation url={path}>
          <App />
        </ServerLocation>
      </Loadable.Capture>,
    ),
  );

  const page = renderPageContents({
    html,
    css,
    head: Head.flush(),
    codeSplitScripts: getCodeSplitScripts(buildStats, modules),
  });

  return page;
}
