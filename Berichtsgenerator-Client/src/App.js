
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from './containers/login';
import Dashboard from './containers/dashboard';
import Detailansicht from './containers/detailansicht';
import Editieransicht from './containers/editieransicht';
import PrivateRoute from './containers/PrivateRoute';
import Logout from './containers/logout';
import Dropdown from './components/dropdown';
import { Provider as AuthProvider } from './utils/auth.js';
import { Provider as UserProvider } from './utils/usersContext.js';
import { Provider as Apiprovider } from './utils/ApiContext.js';
import { Provider as TemplateProvider } from './utils/TemplateContext.js';
import {getUsers, getApiInformation, getTemplateInformation } from './api';
import withAuth from './utils/withAuth.js';
import './App.css';

const AuthDropdown = withAuth(Dropdown);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      user: window.sessionStorage['user'] ? JSON.parse(window.sessionStorage['user']) : null,
      users: [],
      apis: [],
      templates: [],
    };
    this.setUserToState = this.setUserToState.bind(this);
  }
  fetchApi() {
    return getApiInformation();
  }
  fetchTempaltes() {
    return getTemplateInformation();
  }
  fetchUsers() {
    return getUsers();
  }
  setUserToState(user) {
    window.sessionStorage['user'] = JSON.stringify(user);
    this.setState({
      user,
      loggedIn: true
    });
  }
  componentDidMount() {
    Promise.all([
      this.fetchUsers(),
      this.fetchApi(),
      this.fetchTempaltes()
    ]).then((json) => {
        this.setState({
          users: json[0],
          apis: json[1],
          templates: json[2]
        });
      });
  }
  render() {
    const { user, users, apis, templates } = this.state;
    return (
      <AuthProvider value={user}>
        <UserProvider value={users}>
          <Apiprovider value={apis}>
            <TemplateProvider value={templates}>
              <Router basename='#'>
                <div>
                  <header className="App-header">
                    <h1 className="App-title">Berichtsgenerator</h1>
                    <AuthDropdown text={`${user ? user.name : ''} ${user ? user.surname : ''}`}>
                      <Logout className='button--clear button-hover-negativ button-focus-negativ' toState={this.setUserToState} to={'/auth/logout'}>Logout</Logout>
                    </AuthDropdown>
                  </header>
                  { !user ? <Route path="/auth/login" render={() => <Login toState={this.setUserToState} />}/> : ''}
                  <PrivateRoute exact path='/' component={Dashboard} />
                  <PrivateRoute path='/details/:id/:page' component={Detailansicht} />
                  <PrivateRoute path='/edit/:id/:page' component={Editieransicht} />
                </div>
              </Router>
            </TemplateProvider>
          </Apiprovider>
        </UserProvider>
      </AuthProvider>
    );
  }
}

export default App;
