import React from 'react';

import { Text } from './shared';

const Alert = ({ title, children }) => (
  <div
    css={{
      padding: '1rem .75rem',
      backgroundColor: 'rgba(0, 133, 255, .15)',
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
