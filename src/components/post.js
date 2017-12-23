import React from 'react';

import { Block, Link, Separator, Text, Time, Title } from './shared';

const Post = ({ children, date, title }) => (
  <Block>
    <Block marginBottom="1rem">
      <Title marginBottom="1rem">{title}</Title>
      <Time>{date}</Time>
    </Block>
    {children}
    <Separator />
    <Text>
      If you’ve enjoyed reading this post, you can{' '}
      <Link href="https://twitter.com/notjustanyhawk">
        follow me on Twitter
      </Link>{' '}
      for updates.
    </Text>
  </Block>
);

export default Post;
