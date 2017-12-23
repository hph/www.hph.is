import React from 'react';
import glamorous from 'glamorous';

const getMonth = month => {
  return {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
  }[month];
};

const formatDate = datetime => {
  const date = new Date(datetime);
  return `${date.getDate()} ${getMonth(date.getMonth())} ${date.getFullYear()}`;
};

const StyledTime = glamorous('time', { propsAreCssOverrides: true })({
  display: 'block',
  fontSize: `${14 / 16}rem`,
  color: '#737373',
  margin: 0,
  padding: 0,
});

const Time = ({ children, ...restProps }) => (
  <StyledTime dateTime={children} {...restProps}>
    {formatDate(children)}
  </StyledTime>
);

export default Time;
