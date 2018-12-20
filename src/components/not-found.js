import React from 'react';

import { Link, Title } from './shared';

function NotFound({ onRender }) {
  if (onRender) {
    // The routing library currently provides no mechanism of detecting a 404,
    // so we call the provided function to tell the server that the page is not
    // found.
    onRender();
  }

  return (
    <div
      css={{
        margin: '2rem auto',
        width: '40rem',
        '@media (max-width: 719px)': {
          width: '100%',
        },
      }}>
      <Title>Page not found</Title>
      <div css={{ marginTop: '1rem' }}>
        <Link href="/coding">Go home</Link>
      </div>
    </div>
  );
}

export default NotFound;
