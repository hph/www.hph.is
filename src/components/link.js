import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

const Link = props => {
  const { children, href, ...restProps } = props;
  if (href.match(/^http/)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <ReactRouterLink to={href} {...restProps}>
      {children}
    </ReactRouterLink>
  );
};

export default Link;
