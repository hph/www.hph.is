import React from 'react';

import { Text } from './shared';

const Alert = ({ title, children }) => (
  <div
    css={{
      padding: '.75rem 1rem',
      backgroundColor: 'rgba(0, 133, 255, .15)',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25)',
      marginBottom: '1.2rem',
      borderRadius: 2,
    }}>
    <h4
      css={{
        color: '#404040',
        marginBottom: '0.5rem',
      }}>
      {title}
    </h4>
    <Text css={{ margin: 0 }}>{children}</Text>
  </div>
);

export default Alert;
