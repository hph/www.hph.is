import glamorous from 'glamorous';

const Note = glamorous('aside', { propsAreCssOverrides: true })({
  margin: 0,
  padding: 0,
  marginBottom: '1.2rem',
  paddingLeft: '1rem',
  fontSize: '0.9rem',
  fontWeight: 400,
  fontStyle: 'italic',
  color: '#606060',
  lineHeight: '1.65rem',
  borderLeft: '2px solid #0085ff',
});

export default Note;
