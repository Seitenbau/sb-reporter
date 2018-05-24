import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { Consumer } from '../../utils/auth.js';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Consumer>
    {user => <Route {...rest} render={props => {
        return (
          user ? (
            <Component {...props} user={user} />
          ) : (
              <Redirect to={{
                pathname: '/auth/login',
              }} />
          )
        )
      }}
     />
    }
  </Consumer>
);

export default PrivateRoute;
