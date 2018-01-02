import React from 'react';
import glamorous, { Img } from 'glamorous';

import { Link } from './shared';

const mobileBreakpoint = '@media (max-width: 66rem)';

const AuthorSidebar = glamorous('aside', { propsAreCssOverrides: true })({
  maxWidth: '15rem',
  [mobileBreakpoint]: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '44rem',
    padding: '0 2rem 2rem',
  },
});

const SidebarText = glamorous('p')({
  marginBottom: '0.75rem',
  fontSize: 16,
  fontWeight: 400,
  color: '#404040',
  lineHeight: '1.65rem',
  textAlign: 'justify',
  hyphens: 'auto',
  [mobileBreakpoint]: {
    fontSize: '1rem',
  },
});

const About = props => (
  <AuthorSidebar {...props}>
    <Img
      src="//res.cloudinary.com/hph/image/upload/v1514854839/haukur_ntonmo.jpg"
      width={84}
      height={84}
      borderRadius="50%"
      marginBottom="0.5rem"
      css={{ [mobileBreakpoint]: { marginBottom: '1rem' } }}
    />
    <SidebarText>
      Hi there! My name is Haukur, or{' '}
      <Link href="https://en.wiktionary.org/wiki/haukur">
        “Hawk” in English
      </Link>. I’m a software developer from Iceland currently based in London,
      working at <Link href="http://pusher.com/">Pusher</Link>. I write about
      web technologies, JavaScript, front-end performance, and design.
    </SidebarText>
    <SidebarText>
      If you like what you read, make sure to{' '}
      <Link href="https://twitter.com/notjustanyhawk">
        follow me on Twitter
      </Link>.
    </SidebarText>
  </AuthorSidebar>
);

export default About;
