import React from 'react';
import { Link as RouterLink } from '@reach/router';
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

const StyledRouterLink = styled(RouterLink)(anchorStyles);

const Link = props => {
  const { children, href, ...restProps } = props;
  return href.match(/(^http|^mailto\:)/) ? (
    <a css={anchorStyles} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <StyledRouterLink to={href} {...restProps}>
      {children}
    </StyledRouterLink>
  );
};

export default Link;
