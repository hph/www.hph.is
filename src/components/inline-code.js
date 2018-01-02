import glamorous from 'glamorous';

import { monoFonts } from './code';

const InlineCode = glamorous('code', { propsAreCssOverrides: true })({
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
});

export default InlineCode;
