import React from 'react';
import { Route } from 'react-router-dom';

const Status = ({ code, children }) => (
  <Route
    render={({ staticContext }) => {
      if (staticContext) {
        staticContext.status = code; // eslint-disable-line no-param-reassign
      }
      return children;
    }}
  />
);

export default Status;
