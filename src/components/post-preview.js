import React from 'react';
import { Route } from 'react-router-dom';

import { Heading, Link, Text, Time } from './shared';

const PostPreview = ({ url, date, title, introduction, component }) => (
  <div css={{ display: 'flex', flexDirection: 'column', margin: '1rem 0' }}>
    <div>
      <Route key={url} path={`/${url}`} component={component} />
      <Link
        href={`/coding/${url}`}
        onFocus={component.preload}
        onMouseOver={component.preload}
        css={{ textDecoration: 'none !important' }}>
        <Heading css={{ display: 'block', marginBottom: 0 }}>{title}</Heading>
      </Link>
      <Time css={{ margin: '0.5rem 0' }}>{date}</Time>
    </div>
    <Text css={{ marginBottom: '0.5rem' }}>{introduction}</Text>
    <Link
      href={`/coding/${url}`}
      onFocus={component.preload}
      onMouseOver={component.preload}>
      Read more
    </Link>
  </div>
);

export default PostPreview;
