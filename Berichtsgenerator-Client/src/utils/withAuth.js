import React from 'react';
import { Consumer } from './auth.js';

const withAuth = (Component) => (
  (props) => <Consumer>
    {user =>
        user ? (
          <Component {...props} />
        ) : (
          <span />
        )
    }
  </Consumer>
);


export default withAuth;
