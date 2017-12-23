import glamorous from 'glamorous';

const Text = glamorous('p', { propsAreCssOverrides: true })({
  margin: 0,
  padding: 0,
  marginBottom: '1.5rem',
  fontSize: '1rem',
  fontWeight: 400,
  color: '#404040',
  lineHeight: '1.65rem',
});

export default Text;
