import React, { Fragment } from 'react';
import styled from 'react-emotion';

import {
  About,
  Block,
  DocumentTitle,
  Flex,
  Head,
  Link,
  Separator,
  Text,
  Time,
  Title,
} from './shared';

const mobileBreakpoint = '@media (max-width: 66rem)';

const Article = styled('article')({
  maxWidth: '40rem',
  marginRight: '2rem',
  [mobileBreakpoint]: {
    margin: 0,
    width: '100%',
    maxWidth: '44rem',
    padding: '2rem 2rem 0',
  },
});

const Post = ({ children, date, title, introduction }) => (
  <Fragment>
    <DocumentTitle>{title}</DocumentTitle>
    <Head tag="meta" name="description" content={introduction} />
    <Article>
      <Block css={{ marginBottom: '1rem' }}>
        <Title css={{ marginBottom: '1rem' }}>{title}</Title>
        <Flex css={{ justifyContent: 'space-between' }}>
          <Time>{date}</Time>
          <Link href="/coding" css={{ fontSize: 16 }}>
            &larr; All posts
          </Link>
        </Flex>
      </Block>
      {children}
      <Link href="/coding">&larr; All posts</Link>
      <Separator />
      <Block css={{ [mobileBreakpoint]: { display: 'none' } }}>
        <Text>
          If you’ve enjoyed reading this post, you can{' '}
          <Link href="https://twitter.com/notjustanyhawk">
            follow me on Twitter
          </Link>{' '}
          for updates.
        </Text>
      </Block>
    </Article>
    <About />
  </Fragment>
);

export default Post;
