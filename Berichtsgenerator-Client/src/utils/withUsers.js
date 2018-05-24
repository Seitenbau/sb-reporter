import React from 'react';
import { Consumer } from './usersContext.js';

const withUsers = (Component) => (
  (props) => <Consumer>
    { users => <Component users={users} {...props} /> }
  </Consumer>
);


export default withUsers;
