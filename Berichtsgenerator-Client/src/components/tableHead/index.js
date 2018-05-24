import React, { Component } from 'react';
import TableField from '../tableField';
import './tableHead.css';

class TableHead extends Component {

  render() {
    const {className, ...otherProps} = this.props;
    return (
      <TableField
        {...otherProps}
        className= {['tableHead', className].join(' ')}>
        {this.props.children}
      </TableField>
    );
  }
}

export default TableHead;
