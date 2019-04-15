import React from 'react';

import {
  Code,
  Heading,
  InlineCode,
  List,
  Link,
  Note,
  Post,
  Text,
} from '../src/components/shared';

export const title = 'Synchronizing Browser Tabs with the BroadcastChannel API';
export const date = '2019-04-15';
export const introduction =
  'A bit on synchronizing browser tabs with the BroadcastChannel API. Demo inside™.';

class Demo extends React.Component {
  state = {
    color: null,
  };

  componentDidMount() {
    this.channel = new BroadcastChannel('color');
    this.channel.onmessage = message => this.setState({ color: message.data });
  }

  onChange = event => {
    this.setState({ color: event.target.value });
    this.channel.postMessage(event.target.value);
  };

  render() {
    return (
      <div
        css={{
          backgroundColor: this.state.color || '#f6f8fa',
          padding: '40px 0',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1.2rem',
          boxShadow: 'inset 0 0 0px 2px rgba(0, 133, 255, 0.5)',
          borderRadius: 3,
        }}>
        <label
          css={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
          <span css={{ display: 'block', color: '#404040', marginBottom: 10 }}>
            Enter a color, for example, try “hotpink” or “blue”.
          </span>
          <input
            css={{ padding: 4, fontSize: 16 }}
            type="text"
            value={this.state.color}
            onChange={this.onChange}
          />
        </label>
      </div>
    );
  }
}

export default () => (
  <Post title={title} date={date} introduction={introduction}>
    <Text>
      Today, quite unexpectedly, I came across an API called{' '}
      <InlineCode>BroadcastChannel</InlineCode>. It should not, perhaps, have
      come as a surprise, as there’s an uncountable number of browser APIs and
      one shouldn’t expect to be familiar with all of them. This one, however,
      seems to address some problems that I’ve faced in the past quite nicely.
      Let’s dive in, and explore this new API.
    </Text>
    <Heading>API overview</Heading>
    <Text>
      In essence, the API boils down to creating channels, and then posting and
      listening to messages on them. See for yourself:
    </Text>
    <Code>
      {`
      // Create the channel object
      const channel = new BroadcastChannel('my-channel');

      // Set up a listener
      channel.onmessage = message => console.log('Received:', message.data);

      // Post a message to all subscribers
      channel.postMessage('Hello, world');
      `}
    </Code>
    <Text>
      You can try out the above by opening two blank tabs in your browser and
      pasting the code into the console. The first tab you pasted it into should
      log a message once the code is pasted into the second one.
    </Text>
    <Text>
      As you can see the API is quite minimal, but it is also very powerful in
      its simplicity. All you need to do is to create a channel object with an
      appropriate channel name, and all your app’s tabs can communicate
      seamlessly.
    </Text>
    <Note>
      If you wrap the <InlineCode>postMessage</InlineCode> call in a{' '}
      <InlineCode>setTimeout</InlineCode>, or similarly make the call
      asynchronously, i.e., after both have subscribed, you should see the
      message logged in both, or all open tabs. The sender does not receive the
      message, but all channel objects in other tabs or windows will.
    </Note>
    <Heading id="demo">An interactive demo</Heading>
    <Text>
      Try entering a color name, such as ”hotpink”, or ”blue”, into the input
      element below:
    </Text>
    <Demo />
    <Text>
      As you can see, the background color around the input element changes.
    </Text>
    <Text>
      Now try opening{' '}
      <Link
        href="http://localhost:8080/coding/broadcast-channel#demo"
        target="_blank"
        rel="noopener noreferrer">
        this page
      </Link>{' '}
      in a new tab or browser window, and interact with the input again. Did you
      notice what happens? The color is kept in sync in both tabs!
    </Text>
    <Text>
      A minimal reimplementation of the above demo in React might look like
      this, with the relevant areas highlighted in green:
    </Text>
    <Code>
      {`
      function App() {
        const [color, setColor] = React.useState(null);

      ++  const channel = React.useMemo(() => new BroadcastChannel('color'), []);

        React.useEffect(() => {
      ++    channel.onmessage = message => setColor(message.data);
        }, []);

        function onChange(event) {
          setColor(event.target.value);
      ++    channel.postMessage(event.target.value);
        }

        return (
          <div style={{ backgroundColor: color }}>
            <p>Enter a color, for example, try "hotpink" or "blue".</p>
            <input type="text" value={color} onChange={onChange} />
          </div>
        );
      }
      `}
    </Code>
    <Text>
      There’s also a{' '}
      <Link href="https://codesandbox.io/s/9lwvz502op">
        CodeSandbox example here
      </Link>{' '}
      that you can interact with.
    </Text>
    <Heading>So what?</Heading>
    <Text>
      This API is not just for building demos; it can be used to synchronize all
      sorts of state across tabs. I’ve yet to make use of it for anything else
      besides the demo itself, but I can think of a few use cases where it would
      fit well:
    </Text>
    <List>
      <List.Item>
        <Text>
          Passing data across all the user’s tabs, such as the client-side
          application state, without making use of{' '}
          <InlineCode>localStorage</InlineCode>,{' '}
          <InlineCode>WebSockets</InlineCode> or external requests.
        </Text>
      </List.Item>
      <List.Item>
        <Text>
          Avoid creating a <InlineCode>WebSocket</InlineCode> connection or
          making API calls from more than one tab at a time, instead passing the
          data along locally when possible.
        </Text>
      </List.Item>
      <List.Item>
        <Text>
          Synchronizing user session state, like logging in across multiple tabs
          or logging out in the same fashion.
        </Text>
      </List.Item>
    </List>
    <Text>
      While the above examples do not present new solutions to previously
      unsolveable problems, they might present better solutions. For example,
      the <InlineCode>localStorage</InlineCode> API is synchronous, and if used
      heavily it will affect your app’s performance. It’s also limited in that
      it can only store data as strings, among other things. Depending on the
      application, saving network bandwidth could be a benefit.
    </Text>
    <Heading>Further reading</Heading>
    <List>
      <List.Item>
        <Text>
          <Link href="https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel">
            Broadcast Channel on MDN
          </Link>
        </Text>
      </List.Item>
      <List.Item>
        <Text>
          <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API">
            Broadcast Channel API on MDN
          </Link>
        </Text>
      </List.Item>
      <List.Item>
        <Text>
          <Link href="https://developers.google.com/web/updates/2016/09/broadcastchannel">
            Google Developers article
          </Link>
        </Text>
      </List.Item>
    </List>
  </Post>
);
