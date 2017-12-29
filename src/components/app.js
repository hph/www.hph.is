import React from 'react';
import { css } from 'glamor';
import { Route, Switch } from 'react-router-dom';
import glamorous from 'glamorous';

import { DocumentTitle, Title, PostPreview } from './shared';
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

css.global('html, body', {
  margin: 0,
  boxSizing: 'border-box',
  fontFamily: `Source Sans Pro, ${systemFonts.join(', ')}`,
  fontSize: 18,
  textRendering: 'optimizeLegibility',
  WebkitFontSmoothing: 'antialiased',
  color: '#1e1e1e',
  backgroundColor: '#fff',
});

css.global('html', {
  boxSizing: 'border-box',
});

css.global('*, *:before, *:after', {
  boxSizing: 'inherit',
  margin: 0,
  padding: 0,
});

const Main = glamorous('main')({
  margin: '0 auto',
  maxWidth: '45rem',
  padding: '2rem',
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
            <div>
              <Title>Posts</Title>
              {posts.map(post => <PostPreview key={post.url} {...post} />)}
            </div>
          )}
        />
        <Route component={NotFound} />
      </Switch>
    </Main>
  );
}

export default App;
