import React, { Fragment } from 'react';
import { Location, Router } from '@reach/router';
import { injectGlobal } from 'emotion';
import styled from 'react-emotion';

import { About, DocumentTitle, Head, Title, PostPreview } from './shared';
import NotFound from './not-found';
import { pageViewTrackingFunctionName, mobileBreakpoint } from '../constants';
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
  paddingTop: '2rem',
  [mobileBreakpoint]: {
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
    background-color: #f6f8fa;
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
`;

const Home = () => (
  <Fragment>
    <Posts>
      <Title>Hawk is Coding</Title>
      {posts.map(post => <PostPreview key={post.url} {...post} />)}
    </Posts>
    <About css={{ [mobileBreakpoint]: { marginTop: '2rem', order: -1 } }} />
  </Fragment>
);

let firstRender = true;
function onLocationChange(props) {
  if (typeof window !== 'undefined') {
    // Scroll to the top of the page; the router doesn't do it.
    requestAnimationFrame(() =>
      window.scrollTo({ top: 0, behavior: 'smooth' }),
    );

    if (process.env.NODE_ENV === 'production') {
      if (firstRender) {
        firstRender = false;
        return;
      }

      // Notify Google Analytics that we've changed routes.
      window[pageViewTrackingFunctionName](props.location.pathname);
    }
  }
}

function App({ onRenderNotFound }) {
  return (
    <Main>
      <Location>{onLocationChange}</Location>
      <DocumentTitle>Haukur Páll Hallvarðsson</DocumentTitle>
      <Head tag="meta" name="description" content="Haukur Páll Hallvarðsson" />
      <Router>
        {posts.map(({ url, component: Component }) => (
          <Component key={url} path={`/coding/${url}`} />
        ))}
        <Home path="/coding" />
        <NotFound path="*" onRender={onRenderNotFound} />
      </Router>
    </Main>
  );
}

export default App;
