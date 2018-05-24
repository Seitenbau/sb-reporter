import React, { Component } from 'react';
import './text-field.css';

class Textfield extends Component {
  render() {
    const {className, ...otherProps} = this.props;
    return (
      <span
        {...otherProps}
        className={[className, 'textfield'].join(' ')}
      />
    );
  }
}

export default Textfield;
