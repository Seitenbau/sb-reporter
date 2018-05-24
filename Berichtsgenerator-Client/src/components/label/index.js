import React, { Component } from 'react';
import Textfield from '../text-field';
import './label.css';

class Label extends Component {

  render() {
    const {className, ...otherProps} = this.props;
    return (
      <label {...otherProps} className={['label', className].join(' ')}>
          <Textfield className='label--text'>{this.props.text}</Textfield>
          {this.props.children}
      </label>
    );
  }
}

export default Label;
