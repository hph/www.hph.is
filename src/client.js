import React from 'react';
import { hydrate } from 'react-dom';
import { hydrate as hydrateCss } from 'emotion';
import { preloadReady } from 'react-loadable';

import { rootContainerId, hydrationFunctionName } from './constants';

if (typeof window !== 'undefined') {
  window[hydrationFunctionName] = cssIds => {
    // Prevent existing CSS ids from being re-inserted on render.
    // This must be done before the application itself is imported and
    // rendered, see https://goo.gl/zBTH3R for details.
    hydrateCss(cssIds);

    // Now we can safely import the module.
    const { default: App } = require('./components/app'); // eslint-disable-line global-require

    // Wait until all the required modules have been loaded before rendering.
    preloadReady().then(() =>
      hydrate(<App />, document.getElementById(rootContainerId)),
    );
  };
}
