import React from 'react';

import { Link, Title } from './shared';
import Status from './status';

const NotFound = () => (
  <Status code={404}>
    <div css={{ margin: '2rem auto', width: '40rem' }}>
      <Title>Page not found</Title>
      <div css={{ marginTop: '1rem' }}>
        <Link href="/coding">Go home</Link>
      </div>
    </div>
  </Status>
);

export default NotFound;
