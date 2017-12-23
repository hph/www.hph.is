import React from 'react';
import { Route } from 'react-router-dom';

import { Block, Flex, Heading, Link, Text, Time } from './shared';

const PostPreview = ({ url, date, title, introduction, component }) => (
  <Flex flexDirection="column" margin="1rem 0">
    <Block>
      <Route key={url} path={`/${url}`} component={component} />
      <Link
        href={`/coding/${url}`}
        onFocus={component.preload}
        onMouseOver={component.preload}
        style={{ textDecoration: 'none' }}>
        <Heading display="block" marginBottom={0}>
          {title}
        </Heading>
      </Link>
      <Time margin="0.5rem 0">{date}</Time>
    </Block>
    <Text marginBottom="0.5rem">{introduction}</Text>
    <Link
      href={`/coding/${url}`}
      onFocus={component.preload}
      onMouseOver={component.preload}>
      Read more
    </Link>
  </Flex>
);

export default PostPreview;
