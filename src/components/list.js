import styled from 'react-emotion';

const List = styled('ul')({
  marginLeft: '2rem',
  marginBottom: '1.5rem',
  '@media (max-width: 40rem)': {
    marginLeft: '1.25rem',
  },
});

const Item = styled('li')({
  '& *': {
    marginBottom: '.75rem',
  },
});

List.Item = Item;

export default List;
