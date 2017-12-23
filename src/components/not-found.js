import React from 'react';

import { Block, Link, Status, Title } from './shared';

const NotFound = () => (
  <Status code={404}>
    <Title>Page not found</Title>
    <Block marginTop="1rem">
      <Link href="/">Go home</Link>
    </Block>
  </Status>
);

export default NotFound;
