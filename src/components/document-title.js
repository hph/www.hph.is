import React, { Component } from 'react';

import Head from './head';

class DocumentTitle extends Component {
  updateClientSide = () => {
    if (document.title !== this.props.children) {
      document.title = this.props.children;
    }
  };

  render() {
    return (
      <Head tag="title" updateClientSide={this.updateClientSide}>
        {this.props.children}
      </Head>
    );
  }
}

export default DocumentTitle;
