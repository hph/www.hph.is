import React from 'react';
import styled from 'react-emotion';

import { Icon, Link, Separator } from './shared';

const mobileBreakpoint = '@media (max-width: 66rem)';

const AuthorSidebar = styled('aside')({
  maxWidth: '15rem',
  [mobileBreakpoint]: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '44rem',
    padding: '0 2rem 2rem',
  },
});

const SidebarText = styled('p')({
  fontSize: 16,
  fontWeight: 400,
  color: '#404040',
  lineHeight: '1.4rem',
  textAlign: 'justify',
  hyphens: 'auto',
  [mobileBreakpoint]: {
    fontSize: '1rem',
  },
});

const socialProfiles = [
  {
    type: 'email',
    href: 'mailto:hph@hph.is',
    title: 'Email me',
    label: 'hph@hph.is',
  },
  {
    type: 'github',
    href: 'https://github.com/hph',
    title: 'GitHub profile',
    label: 'github.com/hph',
  },
  {
    type: 'twitter',
    href: 'https://twitter.com/notjustanyhawk',
    title: 'Twitter profile',
    label: 'twitter.com/notjustanyhawk',
  },
];

const SocialProfiles = ({ profiles = socialProfiles }) => (
  <div
    css={{
      fontSize: 16,
      a: { display: 'inline-flex', marginBottom: 8 },
      'a>span': { marginRight: 8 },
    }}>
    {profiles.map(({ type, href, title, label }) => (
      <div key={type}>
        <Link href={href}>
          <Icon name={type} size={20} title={title} />
          <span css={{ marginLeft: 8 }}>{label}</span>
        </Link>
      </div>
    ))}
  </div>
);

const About = props => (
  <AuthorSidebar {...props}>
    <img
      src="//res.cloudinary.com/hph/image/upload/v1514854839/haukur_ntonmo.jpg"
      alt="Haukur"
      css={{
        width: 84,
        height: 84,
        borderRadius: '50%',
        marginBottom: '0.5rem',
        [mobileBreakpoint]: {
          marginBottom: '1rem',
        },
      }}
    />
    <SidebarText>
      Hi there! My name is Haukur, or{' '}
      <Link href="https://en.wiktionary.org/wiki/haukur">
        “Hawk” in English
      </Link>. I’m a software developer from Iceland. Among other things, I
      write about web technologies, JavaScript, front-end performance, and
      design.
    </SidebarText>
    <Separator css={{ margin: '1rem 0' }} />
    <SocialProfiles />
  </AuthorSidebar>
);

export default About;
