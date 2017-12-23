import glamorous from 'glamorous';

const Heading = glamorous('h2', { propsAreCssOverrides: true })({
  display: 'inline-block',
  margin: '.5rem 0',
  padding: 0,
  color: '#1e1e1e',
  fontSize: '1.5rem',
  fontWeight: 600,
  lineHeight: '2rem',
});

export default Heading;
