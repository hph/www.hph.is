import React from 'react';
import styled from 'react-emotion';

export const monoFonts = [
  'SFMono-Regular',
  'Consolas',
  'Liberation Mono',
  'Menlo',
  'Courier',
  'monospace',
];

const Pre = styled('pre')({
  display: 'flex',
  flexDirection: 'column',
  margin: '0 1.25rem 1.5rem',
  padding: '.75rem 0',
  borderRadius: 3,
  color: '#141414',
  backgroundColor: '#f6f8fa',
  fontSize: '.875rem',
  lineHeight: 1.5,
  overflow: 'auto',
  '@media (max-width: 40rem)': {
    margin: '0 0 1.5rem',
  },
});

const colorByType = type =>
  ({
    add: 'rgba(155, 245, 155, 0.3)',
    remove: 'rgba(245, 155, 155, 0.3)',
  }[type] || 'transparent');

const InlineCode = styled('code')(props => ({
  display: 'block',
  padding: '0 .75rem',
  height: '1.5em',
  minWidth: 'fit-content',
  fontFamily: monoFonts.join(', '),
  backgroundColor: colorByType(props.type),
}));

function trim(string) {
  let lines = string.split('\n');
  let minIndentation = Infinity;
  lines.forEach(line => {
    const index = line.search(/\S/);
    if (index > -1 && index < minIndentation) {
      minIndentation = index;
    }
  });
  if (lines[0].search(/\S/)) {
    lines = lines.slice(1);
  }
  if (lines[lines.length - 1].search(/\S/)) {
    lines = lines.slice(0, -1);
  }
  return lines.map(line => line.slice(minIndentation));
}

function formatLine(line) {
  const formatting = line.slice(0, 2);
  switch (formatting) {
    case '++':
      return { text: line.slice(2), type: 'add' };
    case '--':
      return { text: line.slice(2), type: 'remove' };
    case '':
      return { text: '\n' };
    default:
      return { text: line };
  }
}

function Code({ children }) {
  const lines = trim(children).map(formatLine);
  return (
    <Pre>
      {lines.map((line, index) => (
        <InlineCode key={index} type={line.type}>
          {line.text}
        </InlineCode>
      ))}
    </Pre>
  );
}

export default Code;
