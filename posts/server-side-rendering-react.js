import React from 'react';

import {
  Code,
  Heading,
  InlineCode,
  Link,
  List,
  Post,
  Text,
} from '../src/components/shared';

export const title = 'Server-side rendering React apps — a primer';
export const date = '2017-12-29';
export const introduction =
  'When it comes to server-rendering React apps there are some complexities involved, and many people resort to frameworks or abandon the effort altogether. In this post I cover how you can build a server-rendered single-page app from scratch.';

export default () => (
  <Post title={title} date={date}>
    <Text>
      When it comes to the architecture of a{' '}
      <Link href="https://reactjs.org/">React</Link> app there are many choices
      to make. Depending on your existing tech stack and the experience that you
      want to create for your end users you can wind up with a wide range of
      different setups. If your aim is to augment a server-rendered app and
      gradually migrate some components into React, you’re probably best off by
      keeping your existing server stack and rendering React only in the client.
      If you’re starting from scratch, however, you have more options:
    </Text>
    <List>
      <List.Item>
        <Text>
          You can use{' '}
          <Link href="https://github.com/facebookincubator/create-react-app">
            Create React App
          </Link>{' '}
          to build a single-page app without having to spend time on learning
          and setting up tooling like{' '}
          <Link href="https://webpack.js.org/">Webpack</Link>.
        </Text>
      </List.Item>
      <List.Item>
        <Text>
          You can use a framework like{' '}
          <Link href="https://github.com/zeit/next.js/">Next.js</Link> or{' '}
          <Link href="https://www.gatsbyjs.org/">Gatsby</Link> to render your
          app statically or on the server. This means that you don’t need to
          learn Webpack, but you do need to learn to use the chosen framework.
        </Text>
      </List.Item>
      <List.Item>
        <Text>
          You can copy one of the many{' '}
          <Link href="https://reactjs.org/community/starter-kits.html">
            starter kits
          </Link>{' '}
          and adapt it to your needs. Out of the three options, this one is
          probably the most problematic for beginners, since the line between
          your code and the boilerplate becomes very blurred.
        </Text>
      </List.Item>
    </List>
    <Text>
      I personally think that you can go with any of the above options, but each
      of them comes with its own set of trade-offs, as frameworks always do. The
      main issues are usually leaky abstractions and framework-specific
      limitations, along with the lack of understanding about the underlying
      technologies that often comes with using frameworks in general.
    </Text>
    <Text>
      In this article, we will explore how to server-render a React app along
      with client-side hydration, which is in effect a server-rendered
      single-page app.
    </Text>
    <Heading>Server-side rendering without a build step</Heading>
    <Text>
      Server-side rendering React apps is in essence quite simple. All you need
      is <Link href="https://nodejs.org/">Node.js</Link> and the React packages
      themselves, which you can install with{' '}
      <Link href="https://yarnpkg.com/lang/en/">Yarn</Link>:
    </Text>
    <Code>yarn init && yarn add react react-dom</Code>
    <Text>
      The above commands will create a new <InlineCode>package.json</InlineCode>{' '}
      file and install the dependencies. With that done, you can create a file
      called <InlineCode>server.js</InlineCode> with the following contents:
    </Text>
    <Code>
      {`
      const http = require('http');
      const React = require('react');
      const { renderToString } = require('react-dom/server');

      const server = http.createServer((req, res) => {
        const app = React.createElement('h1', null, 'Hello, world!');
        const html = renderToString(app);
        res.end(html);
      });

      server.listen(3000);
      `}
    </Code>
    <Text>
      When run, the above code creates a server that responds to all requests
      with an HTML document of{' '}
      <InlineCode>{'<h1>Hello, world!</h1>'}</InlineCode> (open{' '}
      <InlineCode>http://localhost:3000</InlineCode> in your browser).
    </Text>
    <Text>
      The main things to notice about the above snippet is how it differs from a
      client-side app. In the browser, we would use{' '}
      <Link href="https://reactjs.org/docs/react-dom.html#render">
        <InlineCode>render</InlineCode>
      </Link>, which mounts a react instance into a DOM node, instead of{' '}
      <Link href="https://reactjs.org/docs/react-dom-server.html#rendertostring">
        <InlineCode>renderToString</InlineCode>
      </Link>, as we do here.
    </Text>
    <Text>
      Another thing to notice is that we used{' '}
      <InlineCode>React.createElement</InlineCode> over{' '}
      <Link href="https://reactjs.org/docs/introducing-jsx.html">JSX</Link>.
      Using JSX, which is definitely the standard way of writing React code,
      would’ve required us to use <Link href="https://babeljs.io/">Babel</Link>,
      while the point here was to show how simple the basics are. In addition,
      most people don’t stop there but also introduce Webpack or another build
      tool. We’ll explore these in the next step.
    </Text>
    <Heading>Adding a build step: Pulling in Webpack and Babel</Heading>
    <Text>
      For a more realistic and developer-friendly setup, we’re going to have to
      install Webpack and Babel:
    </Text>
    <Code>
      yarn add webpack babel-core babel-loader babel-preset-env
      babel-preset-react
    </Code>
    <Text>
      With these dependencies out of the way, we’re going to refactor our
      previous app to be a stand-alone module. This will be useful later when we
      import it separately in both the server and the client modules. Create a
      new file called <InlineCode>app.js</InlineCode>:
    </Text>
    <Code>
      {`
      import React from 'react';

      export default () => <h1>Hello, world!</h1>;
      `}
    </Code>
    <Text>
      Now we can define an entry point for our application that imports this{' '}
      <InlineCode>App</InlineCode> component. Go ahead and create{' '}
      <InlineCode>client.js</InlineCode>:
    </Text>
    <Code>
      {`
      import React from 'react';
      import { hydrate } from 'react-dom';

      import App from './app';

      hydrate(<App />, document.getElementById('root'), () => {
        console.log('App hydrated in the client!');
      });
      `}
    </Code>
    <Text>
      As the name of the module suggests, the above code should only run in the
      browser. There should be no major changes compared to a regular
      client-rendered React app, except that we use{' '}
      <Link href="https://reactjs.org/docs/react-dom.html#hydrate">
        <InlineCode>hydrate</InlineCode>
      </Link>{' '}
      rather than <InlineCode>render</InlineCode>, and provide a callback as a
      third argument, which will show a message in the console to tell us that
      the application has been re-rendered, or hydrated. You might also have
      noticed that we’re now using{' '}
      <Link href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import">
        ECMAScript module import statements
      </Link>{' '}
      and JSX, which are both supported by the new tooling we installed.
    </Text>
    <Text>
      We can now update our original server module to serve the built client
      bundle to the front end and include it in a{' '}
      <InlineCode>script</InlineCode> tag. The{' '}
      <InlineCode>server.js</InlineCode> file should now be updated as follows
      (green demarks a new line; red a removed line):
    </Text>
    <Code>
      {`
      --const http = require('http');
      --const React = require('react');
      --const { renderToString } = require('react-dom/server');
      ++import http from 'http';
      ++import React from 'react';
      ++import { renderToString } from 'react-dom/server';
      ++import fs from 'fs';

      ++import App from './app';

      ++const clientScript = fs.readFileSync('./build/client.js', {
      ++  encoding: 'utf-8',
      ++});

      const server = http.createServer((req, res) => {
      --  const app = React.createElement('h1', null, 'Hello, world!');
      --  const html = renderToString(app);
      --  res.end(html);
      ++  if (req.url === '/client.js') {
      ++    res.end(clientScript);
      ++  } else {
      ++    const html = renderToString(<App />);
      ++    res.end(\`
      ++      <div id="root">\${html}</div>
      ++      <script src="./client.js"></script>
      ++    \`);
      ++  }
      });

      server.listen(3000);
      `}
    </Code>
    <Text>
      The server module imports our <InlineCode>App</InlineCode> component, just
      like our client module, and wraps it in a <InlineCode>div</InlineCode>{' '}
      with the same Id as in the client module earlier. Besides this, there
      aren’t many changes; mainly plumbing in order to serve the client module
      from a future build directory, which takes us to the last step. We need to
      set up Webpack with a configuration that builds our client and server
      modules. Create a file called <InlineCode>webpack.config.js</InlineCode>:
    </Text>
    <Code>
      {`
      const path = require('path');
      const webpack = require('webpack');

      const shared = {
        output: {
          path: path.resolve('./build'),
          filename: '[name].js',
        },
        module: {
          rules: [
            {
              test: /\.js$/,
              loader: 'babel-loader',
              exclude: /node_modules/,
              options: {
                presets: ['env', 'react'],
              },
            },
          ],
        },
        plugins: [
          // Use the NODE_ENV environment variable to determine whether
          // we use the production or development version of React.
          // Defaults to development when unset.
          new webpack.EnvironmentPlugin({
            NODE_ENV: 'development',
          }),
        ],
      };

      module.exports = [
        Object.assign({}, shared, {
          target: 'web',
          entry: {
            client: './client',
          },
        }),
        Object.assign({}, shared, {
          target: 'node',
          entry: {
            server: './server',
          },
        }),
      ];
      `}
    </Code>
    <Text>
      The above file defines two Webpack configuration objects: one for the
      client module and one for the server module. The content of the
      configuration itself is mostly boilerplate and out of the scope of this
      article, but if you’re interested you may read about the basic{' '}
      <Link href="https://webpack.js.org/concepts/">Webpack concepts</Link>.
      It’s worth noting that minification is left out of the config because we
      can use the <InlineCode>--optimize-minimize</InlineCode> command-line
      argument instead, and the config automatically uses the development or
      production React build as appropriate, based on the{' '}
      <InlineCode>NODE_ENV</InlineCode> environment variable.
    </Text>
    <Text>
      With all of this out of the way—a new <InlineCode>app.js</InlineCode> and{' '}
      <InlineCode>client.js</InlineCode>, a modified{' '}
      <InlineCode>server.js</InlineCode> and a Webpack config—we can build the
      app and run the server:
    </Text>
    <Code>yarn webpack && node build/server.js</Code>
    <Text>
      If you now open <InlineCode>http://localhost:3000</InlineCode> in the
      browser with the developer tools open, you’ll see a message in the console
      saying that the application was hydrated, as determined by our client
      module.
    </Text>
    <Heading>Routing with React Router</Heading>
    <Text>
      Our application is now rendered on the server and the client, but it isn’t
      very useful. After all, it’s only saying “Hello, world!”, despite our
      growingly complex setup. For something a tad more useful, we’re going to
      add{' '}
      <Link href="https://reacttraining.com/react-router/">
        React Router
      </Link>{' '}
      into the mix:
    </Text>
    <Code>yarn add react-router react-router-dom</Code>
    <Text>
      This will install the latest version of React Router, which at the time of
      writing is version 4. The library has been criticized somewhat harshly for
      frequent API changes, and while it now takes full advantage of the React
      component model, it wasn’t always so. Previously, the library was mostly
      used as a{' '}
      <Link href="https://en.wikipedia.org/wiki/Domain-specific_language">
        DSL
      </Link>{' '}
      to define routes, but now it feels much more powerful. The new API might
      seem a bit foreign at first, but as you explore their wonderful
      documentation you might see the flexibility it provides.
    </Text>
    <Text>
      For our purposes, which is to demonstrate how we can integrate SSR
      (server-side rendering) and React Router, we shan’t go into too much
      detail about the intricacies of the routing API or its advanced use cases.
      Instead, we will create three pages: a “home” page and an “about” page,
      along with a “not found” page. To that end, let’s update our{' '}
      <InlineCode>app.js</InlineCode>:
    </Text>
    <Code>
      {`
      import React from 'react';
      ++import { Link, Route, Switch } from 'react-router-dom';

      ++const App = () => (
      ++  <div>
      ++    <Switch>
      ++      <Route exact path="/" render={() => <h1>Home page</h1>} />
      ++      <Route path="/about" render={() => <h1>About page</h1>} />
      ++      <Route render={() => <h1>Not found</h1>} />
      ++    </Switch>
      ++    <p>Links:</p>
      ++    <ul>
      ++      <li>
      ++        <Link to="/">Home page</Link>
      ++      </li>
      ++      <li>
      ++        <Link to="/about">About page</Link>
      ++      </li>
      ++    </ul>
      ++  </div>
      ++);

      --export default () => <h1>Hello, world!</h1>;
      ++export default App;
      `}
    </Code>
    <Text>
      The above code uses{' '}
      <Link href="https://reacttraining.com/react-router/web/api/Switch">
        <InlineCode>Switch</InlineCode>
      </Link>{' '}
      to select at most one of the routes defined within it and{' '}
      <Link href="https://reacttraining.com/react-router/web/api/Route">
        <InlineCode>Route</InlineCode>
      </Link>{' '}
      to determine what is rendered on a given route. Below it, we set up a
      couple of links to the pages we’ve created. However, this is not enough on
      its own; we will also need to update our{' '}
      <InlineCode>client.js</InlineCode> module to use{' '}
      <Link href="https://reacttraining.com/react-router/web/api/BrowserRouter">
        <InlineCode>BrowserRouter</InlineCode>
      </Link>:
    </Text>
    <Code>
      {`
      import React from 'react';
      import { hydrate } from 'react-dom';
      ++import { BrowserRouter } from 'react-router-dom';

      import App from './app';

      --hydrate(<App />, document.getElementById('root'), () => {
      --  console.log('App hydrated in the client!');
      --});
      ++hydrate(
      ++  <BrowserRouter>
      ++    <App />
      ++  </BrowserRouter>,
      ++  document.getElementById('root'),
      ++);
      `}
    </Code>
    <Text>Finally, we need to handle routes on the server.</Text>
    <Code>
      {`
      import http from 'http';
      import fs from 'fs';
      import React from 'react';
      import { renderToString } from 'react-dom/server';
      ++import { StaticRouter } from 'react-router';

      import App from './app';

      const clientScript = fs.readFileSync('./build/client.js', {
        encoding: 'utf-8',
      });

      const server = http.createServer((req, res) => {
        if (req.url === '/client.js') {
          res.end(clientScript);
        } else {
      --    const html = renderToString(<App />);
      ++    const context = {};
      ++    const html = renderToString(
      ++      <StaticRouter location={req.url} context={context}>
      ++        <App />
      ++      </StaticRouter>,
      ++    );
      ++    res.statusCode = context.status || 200;
          res.end(\`
            <div id="root">\${html}</div>
            <script src="./client.js"></script>
          \`);
        }
      });

      server.listen(3000);
      `}
    </Code>
    <Text>
      If you now run{' '}
      <InlineCode>yarn webpack && node build/server.js</InlineCode> and navigate
      to <InlineCode>http://localhost:3000</InlineCode> again, you’ll see that
      the application has the following properties:
    </Text>
    <List>
      <List.Item>
        <Text>
          The “home” page is rendered by default and the user can navigate to an
          “about” page. If you navigate to a page that doesn’t exist you will
          get the “not found” page.
        </Text>
      </List.Item>
      <List.Item>
        <Text>
          The client never does a full page refresh, it simply updates the
          content of the page as you navigate around. This is consistent with
          single-page apps.
        </Text>
      </List.Item>
      <List.Item>
        <Text>
          You can always access a page directly by URL, that is, the server
          always responds with the appropriate page, be it the “home” page, the
          “about” page or a non-existent page.
        </Text>
      </List.Item>
    </List>
    <Text>
      As you can see, we have effectively implemented a server-rendered,
      single-page app. I believe that a configuration based on these ideas can
      provide an optimal user experience and performance, and it’s not at all
      necessary to use a framework to do these things for us. The example
      application that we have built is very simple, but the approach scales to
      a medium-sized and large app as well. However, there are some further
      optimizations to be made and chief among them is route and component-based{' '}
      {' '}
      <Link href="https://webpack.js.org/guides/code-splitting/">
        code splitting
      </Link>. I will write about these performance optimization techniques in a
      later post.
    </Text>
  </Post>
);
