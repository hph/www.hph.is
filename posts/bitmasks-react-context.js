import React from 'react';

import {
  Code,
  Heading,
  InlineCode,
  Link,
  Note,
  Post,
  Text,
} from '../src/components/shared';

export const title = 'Bitmasks and the new React Context API';
export const date = '2018-02-25';
export const introduction =
  'With the imminent release of React 16.3.0, the experimental Context API receives a major overhaul and is finally officially supported as a core part of the React API. Using it properly, however, may require understanding bitmasks.';

export default () => (
  <Post title={title} date={date} introduction={introduction}>
    <Text>
      If you’ve used React, and you’ve spent some time browsing its
      documentation, you may have come across the section on the Context API
      which starts by discouraging its use altogether, saying that it is
      experimental and subject to change in the future. This is particularly
      disheartening because context can solve some common problems quite
      conveniently, such as providing application state down a deeply nested
      tree and building interdependent or compound components that would
      otherwise require their user to manually control them.
    </Text>
    <Text>
      Finally, the time has come — the release of React 16.3.0 is imminent and
      it includes a new and fully sanctioned Context API. I’m especially excited
      about this update due to its potential to positively impact how React
      applications and components are built.
    </Text>
    <Text>
      In this post, I will cover all the essential parts of the new API along
      with an interesting escape hatch that it provides for performance
      optimization.
    </Text>
    <Heading>The new Context API</Heading>
    <Text>
      <Link href="https://twitter.com/acdlite">Andrew Clark</Link>, a core
      member of the React team at Facebook, recently introduced a{' '}
      <Link href="https://github.com/reactjs/rfcs/pull/2">
        proposal for a new Context API
      </Link>. The proposal was quickly accepted and has now been implemented
      and merged, and it will be included as part of the next minor version
      update of React. Conveniently, it has already been released under the{' '}
      <InlineCode>next</InlineCode> tag, which makes it publicly available for
      anyone to try it out:
    </Text>
    <Code>yarn add react@next react-dom@next</Code>
    <Text>
      The following should demonstrate the absolute basics of the new API (see{' '}
      <Link href="https://codesandbox.io/s/q91lxvm839">interactive demo</Link>):
    </Text>
    <Code>
      {`
      import React from 'react';
      import { render } from 'react-dom';

      const { Consumer, Provider } = React.createContext();

      render(
        <Provider value="Hello, world!">
          <div>
            <Consumer>{value => <p>{value}</p>}</Consumer>
          </div>
        </Provider>,
        document.getElementById('root'),
      );
      `}
    </Code>
    <Text>
      In the above example, we’ve created two components with{' '}
      <InlineCode>React.createContext</InlineCode>. The resulting{' '}
      <InlineCode>Provider</InlineCode> component makes any value it is given,
      accessible to any and all instances of the associated{' '}
      <InlineCode>Consumer</InlineCode> component. The{' '}
      <InlineCode>div</InlineCode> between the two components is not required;
      it is only there to demonstrate that there’s no direct parent–child
      relationship between them for the sake of supplying the data.
    </Text>
    <Heading>Providing application state</Heading>
    <Text>
      Generally speaking, it’s not good practice to make all components rely
      directly on a global state store, since highly coupled code is harder to
      extend, refactor, and test. Thankfully, we can address this by creating
      regular components (i.e., standard prop–based rather than context–based
      components) and then wrap them in order to provide them with access to any
      data that they may need.
    </Text>
    <Text>
      We’ll start by creating a higher-order component that uses the same{' '}
      <InlineCode>Consumer</InlineCode> that we created earlier:
    </Text>
    <Code>
      {`
      const withState = WrappedComponent => props => (
        <Consumer>
          {state => <WrappedComponent {...state} {...props} />}
        </Consumer>
      );
      `}
    </Code>
    <Note>
      Whilst the above higher–order component function will work, there are more
      things to take into consideration before using it, such as giving the
      resulting component a name (for developer tools) and potentially making it
      pure in order to avoid rerenders. Please refer to the{' '}
      <Link href="https://reactjs.org/docs/higher-order-components.html">
        higher-order component docs
      </Link>{' '}
      for a more detailed brief.
    </Note>
    <Text>
      We can now use this function to wrap any components that require access to
      application state. For instance, let’s create a couple of components that
      respectively rely on a <InlineCode>user</InlineCode> object and a{' '}
      <InlineCode>films</InlineCode> array:
    </Text>
    <Code>
      {`
      const Welcome = ({ user }) => (
        <p>Hello, {user.name}!</p>
      );

      const FavouriteFilms = ({ films }) => (
        <div>
          <p>Some of your favourite films are:</p>
          <ul>
            {films.map(film => (
              <li key={film.name}>{film.name}</li>
            )}
          </ul>
        </div>
      );

      // Wrap the components separately to give access to both variants.
      const WelcomeWithState = withState(Welcome);
      const FavouriteFilmsWithState = withState(FavouriteFilms);
      `}
    </Code>
    <Text>
      With the components defined, we can now define our application state and
      render them:
    </Text>
    <Code>
      {`
      const state = {
        user: {
          name: 'Hawk',
        },
        films: [
          {
            name: 'There Will Be Blood',
          },
          {
            name: 'Apocalypse Now',
          },
        ],
      };

      /**
       * The below is equivalent with passing props to the
       * original components:
       *
       *   <Welcome user={state.user} />
       *   <FavouriteFilms films={state.films} />
       */
      render(
        <Provider value={state}>
          <WelcomeWithState />
          <FavouriteFilmsWithState />
        </Provider>,
        document.getElementById('root'),
      );
      `}
    </Code>
    <Text>
      The above may not seem all that useful, but in a growing or large
      application this approach will quickly start to pay off. However, this
      example lacks one crucial aspect of a real-world app: the data is static.
      We can provide a way to update the state by wrapping the{' '}
      <InlineCode>Provider</InlineCode> component in its own provider of sorts,
      and update it with good old <InlineCode>state</InlineCode>.
    </Text>
    <Code>
      {`
      class StateProvider extends React.Component {
        state = {
          ...this.props.initialState,
          setGlobalState: this.setState.bind(this),
        };

        render () {
          return (
            <Provider value={this.state}>
              {this.props.children}
            </Provider>
          );
        }
      }

      render(
      --  <Provider value={state}>
      ++  <StateProvider initialState={initialState}>
          <WelcomeWithState />
          <FavouriteFilmsWithState />
      --  </Provider>,
      ++  </StateProvider>
        document.getElementById('root'),
      );
      `}
    </Code>
    <Text>
      Any descendants of <InlineCode>StateProvider</InlineCode> can now make use
      of <InlineCode>setGlobalState</InlineCode>, which is available as a prop,
      to update the state tree. To see an example of this, check out{' '}
      <Link href="https://codesandbox.io/s/m52rj8yp3x">this demo</Link> which
      includes an input and a button to update the list of favourite films.
    </Text>
    <Heading>What about performance?</Heading>
    <Text>
      In a large and complex React application, it is important to prevent
      unnecessary rerenders. As you may have guessed, all the instances of{' '}
      <InlineCode>Consumer</InlineCode> will rerender unless explicitly told not
      to. In order to implement something more akin to the{' '}
      <Link href="https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern">
        publish-subscribe
      </Link>{' '}
      pattern, where subscribers (or here, consumers) only receive the slice of
      the state that they subscribe to, we must provide a way for React to know
      whether to update the component or not.
    </Text>
    <Text>
      This is where{' '}
      <Link href="https://en.wikipedia.org/wiki/Mask_(computing)">
        bitmasks
      </Link>{' '}
      come in. The new <InlineCode>React.createContext</InlineCode> takes a
      function as an optional second argument. This function, referred to
      internally as <InlineCode>calculateChangedBits</InlineCode>, is called by
      the associated <InlineCode>Provider</InlineCode> every time its value
      changes. The function receives the current and the next value as
      arguments, and this can be used to create a bitmask. Instances of the{' '}
      <InlineCode>Consumer</InlineCode> component must then be provided with an{' '}
      <InlineCode>observedBits</InlineCode> prop, which will determine whether
      the component needs to be updated or not.
    </Text>
    <Text>
      As a simple (and perhaps rather contrived) example, consider a UI that has
      a single number as its state and updates every second to display the
      current value, the last odd number, and the last even number. The current
      value should be updated every second, while the other two should only be
      updated when the current tick of the value is either even or odd. While
      the performance implications in this particular example are negligible,
      this provides a good starting point to see the context API employs
      bitmasks:
    </Text>
    <Code>
      {`
      const calculateChangedBits = (currentValue, nextValue) => {
        return nextValue.value % 2 === 0 ? 10 : 1;
      };
      `}
    </Code>
    <Text>
      The above function will always return <InlineCode>1</InlineCode> or{' '}
      <InlineCode>10</InlineCode>, since all the numbers that we will be dealing
      with are either even or odd. Using this, we can create a new context and
      provide the appropriate <InlineCode>observedBits</InlineCode> prop to our
      consumers (see the{' '}
      <Link href="https://codesandbox.io/s/00l2x10wpw">full demo here</Link>):
    </Text>
    <Code>
      {`
      const { Consumer, Provider } = React.createContext(
        null,
        calculateChangedBits,
      );

      // Counter component, interval updates and changes to
      // withState omitted; see the linked demo for a full example.

      render(
        <StateProvider initialState={{ value: 0 }}>
          <Counter label="Current value" observedBits={11} />
          <Counter label="Odd" observedBits={1} />
          <Counter label="Even" observedBits={10} />
        </StateProvider>,
        document.getElementById("root"),
      );
      `}
    </Code>
    <Note>
      The observedBits prop is included here for demonstration purposes only and
      should otherwise not be exposed to the user. The withState wrapper
      function could instead be used to automatically inject the prop into the
      consumer based on a local heuristic, such as making a shallow comparison
      of the component props.
    </Note>
    <Text>
      In the above example, with the omitted parts included, the first{' '}
      <InlineCode>Counter</InlineCode> would be rerendered every time, since
      both <InlineCode>1</InlineCode> and <InlineCode>10</InlineCode> are
      “observed bits” in <InlineCode>11</InlineCode>. The second will only
      render when our <InlineCode>calculateChangedBits</InlineCode> function
      returns <InlineCode>1</InlineCode>, and the third when it returns{' '}
      <InlineCode>10</InlineCode>. To illustrate how this works, consider the
      following example using the{' '}
      <Link href="https://en.wikipedia.org/wiki/Bitwise_operation#AND">
        bitwise AND operator
      </Link>, where a non–zero return value means that the bit was set (you can
      run this in your browser’s console):
    </Text>
    <Code>
      {`
      // With a calculateChangedBits result of 1:
      1 & 1  // -> 1, render
      1 & 10 // -> 0
      1 & 11 // -> 1, render

      // With a calculateChangedBits result of 10:
      10 & 1  // -> 0
      10 & 10 // -> 10, render
      10 & 11 // -> 10, render
      `}
    </Code>
    <Text>
      Ostensibly, the reason for which bitmasks were chosen for this purpose is
      that they can efficiently encode the boolean state of which child
      consumers should be updated with a single function call. Most of the time,
      this feature will only be used by libraries such as Redux, MobX, styling
      libraries, and so forth, but it’s good to know of its existence in case
      you need it.
    </Text>
  </Post>
);
