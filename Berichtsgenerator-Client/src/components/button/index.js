import React, { Component } from 'react';
import './button.css';

class Button extends Component {

  render() {
    const {className, ...otherProps} = this.props;
    return (
      <button
        {...otherProps}
        className={['button', className].join(' ')}
      />
    );
  }
}

export default Button;
