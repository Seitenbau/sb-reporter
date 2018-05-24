import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from '../../components/button';
import './logout.css';

class Logout extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.state = {
      loggedOut: false
    }
  }
  logout() {
    fetch('/logout').then(() => {
      this.props.history.push('/auth/login');
      this.props.toState(null);
    })
  }
  render() {
    return (
      <Button
        className={`logout ${this.props.className}`}
        onClick={this.logout}>
          {this.props.children}
        </Button>
    );
  }
}

export default withRouter(Logout);
