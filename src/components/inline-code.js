import styled from 'react-emotion';

import { monoFonts } from './code';

const InlineCode = styled('code', { propsAreCssOverrides: true })(
  {
    display: 'inline-flex',
    alignItems: 'center',
    padding: `0 ${2 / 16}rem`,
    borderRadius: `${2 / 16}rem`,
    lineHeight: 1.5,
    hyphens: 'none',
    color: '#141414',
    backgroundColor: '#f6f8fa',
    fontFamily: monoFonts.join(', '),
    fontSize: `${14 / 16}rem`,
    fontStyle: 'normal',
  },
  props =>
    props.transparent && {
      backgroundColor: 'transparent',
      padding: 0,
    },
);

export default InlineCode;
