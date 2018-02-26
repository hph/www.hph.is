import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import styled from 'react-emotion';

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

const StyledRouterLink = styled(ReactRouterLink)(anchorStyles);

const Link = props => {
  const { children, href, ...restProps } = props;
  if (href.match(/^http/)) {
    return (
      <a
        css={anchorStyles}
        href={href}
        target="_blank"
        rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <StyledRouterLink to={href} {...restProps}>
      {children}
    </StyledRouterLink>
  );
};

export default Link;
