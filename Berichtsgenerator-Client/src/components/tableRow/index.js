import React, { Component } from 'react';
import './tableRow.css';

class TableRow extends Component {

  render() {
    const {className, ...otherProps} = this.props;
    return (
      <div
        {...otherProps}
        className={['tableRow', className].join(' ')}>
        {this.props.children}
      </div>
    );
  }
}

export default TableRow;
