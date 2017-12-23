import React from 'react';
import { hydrate } from 'react-dom';
import { rehydrate } from 'glamor';
import { preloadReady } from 'react-loadable';
import { Router } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import {
  rootContainerId,
  hydrationFunctionName,
  pageViewTrackingFunctionName,
} from './constants';

const isProd = process.env.NODE_ENV === 'production';

if (typeof window !== 'undefined') {
  window[hydrationFunctionName] = cssIds => {
    // Prevent existing CSS ids from being re-inserted on render.
    // This must be done before the application itself is imported and
    // rendered, see https://goo.gl/zBTH3R for details.
    rehydrate(cssIds);

    // Now we can safely import the module.
    const { default: App } = require('./components/app'); // eslint-disable-line global-require

    const history = createHistory();

    // Notify Google Analytics that we've changed routes.
    if (isProd) {
      history.listen(({ pathname }) => {
        window[pageViewTrackingFunctionName](pathname);
      });
    }

    // Wait until all the required modules have been loaded before rendering.
    preloadReady().then(() =>
      hydrate(
        <Router history={history}>
          <App />
        </Router>,
        document.getElementById(rootContainerId),
      ));
  };
}
