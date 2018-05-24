import React, { Component } from 'react';
import './tableField.css';

class TableField extends Component {

  render() {
    const {className, ...otherProps} = this.props;

    return (
      <div
        {...otherProps}
        className={['tableField', className].join(' ')}>
        {this.props.children}
      </div>
    );
  }
}

export default TableField;
