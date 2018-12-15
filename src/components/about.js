import React from 'react';
import styled from 'react-emotion';

import { Icon, Link } from './shared';
import { mobileBreakpoint } from '../constants';

export const profilePictureUrl =
  '//res.cloudinary.com/hph/image/upload/c_scale,q_76,w_480/v1542564234/author.jpg';

const AuthorSidebar = styled('aside')({
  position: 'fixed',
  right: 'calc((100% - 60rem) / 2)',
  maxWidth: '18rem',
  [mobileBreakpoint]: {
    position: 'relative',
    right: 'auto',
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
      height: 84,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      a: { display: 'inline-flex' },
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
    <div
      css={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 12,
      }}>
      <SocialProfiles />
      <img
        src={profilePictureUrl}
        alt="Haukur"
        css={{
          width: 84,
          height: 84,
          marginTop: -6, // Correct for illusory misalignment.
          borderRadius: '50%',
          [mobileBreakpoint]: {
            marginBottom: '1rem',
          },
        }}
      />
    </div>
    <SidebarText>
      Hi there! My name is Haukur, or{' '}
      <Link href="https://en.wiktionary.org/wiki/haukur">
        “Hawk” in English
      </Link>. I’m a software developer from Iceland. Among other things, I
      write about web technologies, JavaScript, front-end performance, and
      design.
    </SidebarText>
  </AuthorSidebar>
);

export default About;
