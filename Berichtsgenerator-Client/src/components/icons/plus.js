import React, { Component } from 'react';
import './icon.css'

class Plus extends Component {

  render() {
    const {className,  ...rest} = this.props;
    return(
      <svg {...rest} className={['icon', className].join(' ')} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M24 9h-9v-9h-6v9h-9v6h9v9h6v-9h9z"/>
      </svg>
    )
  }
}

export default Plus;
