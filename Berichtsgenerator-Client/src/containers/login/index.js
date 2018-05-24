import React, { Component } from 'react';
import Input from '../../components/input';
import From from '../../components/form';
import Label from '../../components/label';
import { withRouter } from "react-router";
import { login } from '../../api';

import './login.css';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      alerts: [],
      redirectToReferrer: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePasswort = this.handleChangePasswort.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    login({
      username: this.state.username,
      password: this.state.password
    }).then((res) => {
      switch (res.status) {
        case 401:
          this.setState({alert: this.state.alerts.push('Ungültige Eingabe')})
          break;
        case 200:
          this.setState({
            alert: this.state.alerts.push('Erfolg'),
          });

          break;
        default:
      }
      return res.json();
    })
    .then((res) => {
      this.setState({
        redirectToReferrer: true,
      }, () => this.props.toState(res));
    })
    .catch((err) => {
      console.log(err);
    })
  }
  handleChangeUsername(event) {
    this.setState({
      username: event.target.value,
      alerts: []
    });
  }
  handleChangePasswort(event) {
    this.setState({
      password: event.target.value,
      alerts: []
    });
  }
  componentWillUpdate(nextProps, nextState) {
    const { redirectToReferrer } = nextState;
    if(redirectToReferrer === true) {
      this.props.history.push('/');
    }
  }
  render() {

    return (
      <div className='login'>
        <From onSubmit={this.handleSubmit}>
          <div key={0}>
            {this.state.alerts.length > 0 ? this.state.alerts.map((alert, i) => <span key={i}>{alert}</span>) : ''}
          </div>
          <Label text='Nutzername:'>
            <Input
              key={1}
              type='text'
              className='btn-default'
              name='username'
              onChange={this.handleChangeUsername}
              autoFocus/>
          </Label>
          <Label text='Passwort:'>
            <Input
              key={2}
              type='password'
              className='btn-default'
              name='password'
              onChange={this.handleChangePasswort}/>
          </Label>
          <Input
            key={3}
            type='submit'
            className='button button-text-center button-default input-submit'
            name='submit'
            value='Anmelden' />
        </From>
      </div>
    );
  }
}

export default withRouter(Login);
