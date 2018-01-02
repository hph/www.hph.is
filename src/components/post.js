import React, { Fragment } from 'react';
import glamorous from 'glamorous';

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

const Article = glamorous('article')({
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
      <Block marginBottom="1rem">
        <Title marginBottom="1rem">{title}</Title>
        <Flex justifyContent="space-between">
          <Time>{date}</Time>
          <Link href="/coding" style={{ fontSize: 16 }}>
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
