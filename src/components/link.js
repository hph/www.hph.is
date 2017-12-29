import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import glamorous, { A } from 'glamorous';

const anchorStyles = {
  textDecoration: 'none',
  color: '#0085ff',
  ':hover': {
    textDecoration: 'underline',
  },
  ':visited': {
    color: '#9b04e2',
  },
};

const StyledRouterLink = glamorous(ReactRouterLink)(anchorStyles);

const Link = props => {
  const { children, href, ...restProps } = props;
  if (href.match(/^http/)) {
    return (
      <A
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        css={anchorStyles}>
        {children}
      </A>
    );
  }
  return (
    <StyledRouterLink to={href} {...restProps}>
      {children}
    </StyledRouterLink>
  );
};

export default Link;
