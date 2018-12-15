import React from 'react';
import { hydrate } from 'react-dom';
import { preloadReady } from 'react-loadable';

import App from './components/app';
import { rootContainerId } from './constants';

preloadReady().then(() => {
  hydrate(<App />, document.getElementById(rootContainerId));
});
