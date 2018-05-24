import React, { Component } from 'react';
import './input.css';

class Input extends Component {

  render() {
    const { className, inputRef, ...otherProps} = this.props;
    return (
      <input
        {...otherProps}
        ref={inputRef}
        className={['input', className].join(' ')}
      />
    );
  }
}

export default Input;
