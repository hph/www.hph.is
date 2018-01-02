import React, { Fragment } from 'react';
import { css } from 'glamor';
import { Route, Switch } from 'react-router-dom';
import glamorous from 'glamorous';

import { About, DocumentTitle, Title, PostPreview } from './shared';
import NotFound from './not-found';

import posts from '../../build/all-posts';

// System fonts based on the ones GitHub uses.
const systemFonts = [
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

css.global(':root', {
  fontFamily: `Source Sans Pro, ${systemFonts.join(', ')}`,
  fontSize: 18,
  textRendering: 'optimizeLegibility',
  WebkitFontSmoothing: 'antialiased',
});

css.global(':root', {
  boxSizing: 'border-box',
});

css.global('*, *:before, *:after', {
  boxSizing: 'inherit',
  margin: 0,
  padding: 0,
});

const mobileBreakpoint = '@media (max-width: 66rem)';

const Main = glamorous('main')({
  display: 'flex',
  justifyContent: 'center',
  padding: '2rem 0',
  [mobileBreakpoint]: {
    padding: 0,
    flexDirection: 'column',
    alignItems: 'center',
  },
});

const Posts = glamorous('section')({
  maxWidth: '40rem',
  marginRight: '2rem',
  [mobileBreakpoint]: {
    margin: 0,
    padding: '0 2rem 2rem',
    maxWidth: '44rem',
  },
});

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
