import glamorous from 'glamorous';

const Title = glamorous('h1', { propsAreCssOverrides: true })({
  margin: 0,
  padding: 0,
  color: '#1e1e1e',
  fontSize: '2rem',
  fontWeight: 600,
  lineHeight: `${36 / 16}rem`,
});

export default Title;
