import glamorous from 'glamorous';

import { monoFonts } from './code';

const InlineCode = glamorous('code', { propsAreCssOverrides: true })({
  padding: `${2 / 16}rem`,
  borderRadius: `${2 / 16}rem`,
  color: '#141414',
  backgroundColor: '#f6f8fa',
  fontFamily: monoFonts.join(', '),
  fontSize: `${14 / 16}rem`,
  fontStyle: 'normal',
});

export default InlineCode;
