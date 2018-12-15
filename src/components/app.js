import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import { injectGlobal } from 'emotion';
import styled from 'react-emotion';

import { About, DocumentTitle, Title, PostPreview } from './shared';
import NotFound from './not-found';
import { mobileBreakpoint } from '../constants';
import posts from '../../build/all-posts';

// System fonts based on the ones GitHub uses.
const systemFonts = [
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'Helvetica',
  'Arial',
  'sans-serif',
  'Apple Color Emoji',
  'Segoe UI Emoji',
  'Segoe UI Symbol',
];

const Main = styled('main')({
  display: 'flex',
  justifyContent: 'center',
  padding: '2rem 0',
  [mobileBreakpoint]: {
    padding: 0,
    flexDirection: 'column',
    alignItems: 'center',
  },
});

const Posts = styled('section')({
  position: 'absolute',
  left: 'calc((100% - 60rem) / 2)',
  maxWidth: '40rem',
  marginRight: '2rem',
  [mobileBreakpoint]: {
    position: 'relative',
    left: 'auto',
    margin: 0,
    padding: '0 2rem 2rem',
    maxWidth: '44rem',
  },
});

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  :root {
    font-family: Source Sans Pro, ${systemFonts.join(', ')};
    font-size: 18px;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
    margin: 0;
    padding: 0;
  }

  /* source-sans-pro-400normal - latin */
  @font-face {
    font-family: 'Source Sans Pro';
    font-style: normal;
    font-display: swap;
    font-weight: 400;
    src:
      local('Source Sans Pro Regular '),
      local('Source Sans Pro-Regular'),
      url('/source-sans-pro-latin-400.woff2') format('woff2'), /* Super Modern Browsers */
      url('/source-sans-pro-latin-400.woff') format('woff'); /* Modern Browsers */
  }

  /* source-sans-pro-400italic - latin */
  @font-face {
    font-family: 'Source Sans Pro';
    font-style: italic;
    font-display: swap;
    font-weight: 400;
    src:
      local('Source Sans Pro Regular italic'),
      local('Source Sans Pro-Regularitalic'),
      url('/source-sans-pro-latin-400italic.woff2') format('woff2'), /* Super Modern Browsers */
      url('/source-sans-pro-latin-400italic.woff') format('woff'); /* Modern Browsers */
  }

  /* source-sans-pro-600normal - latin */
  @font-face {
    font-family: 'Source Sans Pro';
    font-style: normal;
    font-display: swap;
    font-weight: 600;
    src:
      local('Source Sans Pro SemiBold '),
      local('Source Sans Pro-SemiBold'),
      url('/source-sans-pro-latin-600.woff2') format('woff2'), /* Super Modern Browsers */
      url('/source-sans-pro-latin-600.woff') format('woff'); /* Modern Browsers */
  }

  /* source-sans-pro-600italic - latin */
  @font-face {
    font-family: 'Source Sans Pro';
    font-style: italic;
    font-display: swap;
    font-weight: 600;
    src:
      local('Source Sans Pro SemiBold italic'),
      local('Source Sans Pro-SemiBolditalic'),
      url('/source-sans-pro-latin-600italic.woff2') format('woff2'), /* Super Modern Browsers */
      url('/source-sans-pro-latin-600italic.woff') format('woff'); /* Modern Browsers */
  }
`;

function App() {
  return (
    <Main>
      <DocumentTitle>Hawk is Coding</DocumentTitle>
      <Switch>
        {posts.map(({ url, component }) => (
          <Route key={url} path={`/coding/${url}`} component={component} />
        ))}
        <Route
          path="/coding"
          exact
          render={() => (
            <Fragment>
              <Posts>
                <Title>All posts</Title>
                {posts.map(post => <PostPreview key={post.url} {...post} />)}
              </Posts>
              <About
                css={{ [mobileBreakpoint]: { marginTop: '2rem', order: -1 } }}
              />
            </Fragment>
          )}
        />
        <Route component={NotFound} />
      </Switch>
    </Main>
  );
}

export default App;
