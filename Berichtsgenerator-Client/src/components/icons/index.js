import React, { Component } from 'react';
import Pencil from './pencil.js';
import Eye from './eye.js';
import Singelarrow from './singelarrow.js';
import Doublearrow from './doublearrow.js';
import Plus from './plus';

class Icon extends Component {

  getIcon(name) {
    switch (name) {
      case 'PENCIL':
        return Pencil;
      case 'EYE':
        return Eye;
      case 'DOUBLE':
        return Doublearrow
      case 'SINGEL':
        return Singelarrow;
      case 'PLUS':
        return Plus;
      default:
      return () => {}
    }
  }

  render() {
    const { icon, ...rest } = this.props;
    const Icon = this.getIcon(icon)
    return (<Icon {...rest} />)
  }
}

export default Icon;
