import glamorous from 'glamorous';

const List = glamorous('ul')({
  marginLeft: '2rem',
  marginBottom: '1.5rem',
  '@media (max-width: 40rem)': {
    marginLeft: '1.25rem',
  },
});

const Item = glamorous('li')({
  '& *': {
    marginBottom: '.75rem',
  },
});

List.Item = Item;

export default List;
