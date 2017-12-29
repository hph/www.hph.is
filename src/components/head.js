import { Component } from 'react';

let items = [];

class Head extends Component {
  static flush() {
    const flushedItems = items;
    items = [];
    return flushedItems;
  }

  componentWillMount() {
    if (typeof window === 'undefined') {
      const { updateClientSide, ...restProps } = this.props;
      if (restProps.tag === 'title') {
        const titleTagIndex = items.findIndex(item => item.tag === 'title');
        if (titleTagIndex > -1) {
          // Use the last document title defined, when more than one has been
          // set for the page.
          items[titleTagIndex] = restProps;
        } else {
          items.push(restProps);
        }
      } else {
        items.push(restProps);
      }
    }
  }

  componentDidMount() {
    this.updateClientSide();
  }

  componentWillUpdate() {
    this.updateClientSide();
  }

  updateClientSide = () => {
    const { updateClientSide, ...restProps } = this.props;
    if (updateClientSide) {
      updateClientSide(restProps);
    }
  };

  render() {
    return null;
  }
}

export default Head;
