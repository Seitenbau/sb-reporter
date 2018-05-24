import React, { Component } from 'react';
import './icon.css'

class Doublearrow extends Component {

  render() {
    const {className,  ...rest} = this.props;
    return(
      <svg {...rest} className={['icon', className].join(' ')} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M0 3.795l2.995-2.98 11.132 11.185-11.132 11.186-2.995-2.981 8.167-8.205-8.167-8.205zm18.04 8.205l-8.167 8.205 2.995 2.98 11.132-11.185-11.132-11.186-2.995 2.98 8.167 8.206z"/>
      </svg>
    )
  }
}

export default Doublearrow;
