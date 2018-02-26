import React from 'react';

import { Block, Link, Title } from './shared';
import Status from './status';

const NotFound = () => (
  <Status code={404}>
    <Block css={{ margin: '2rem auto', width: '40rem' }}>
      <Title>Page not found</Title>
      <Block css={{ marginTop: '1rem' }}>
        <Link href="/coding">Go home</Link>
      </Block>
    </Block>
  </Status>
);

export default NotFound;
