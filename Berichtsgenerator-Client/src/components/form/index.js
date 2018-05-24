import React, { Component } from 'react';
import './form.css';

class Form extends Component {

  render() {
    return (
      <form
        {...this.props}
        className={`form ${this.props.className}`}>
          {this.props.children}
        </form>
    );
  }
}

export default Form;
