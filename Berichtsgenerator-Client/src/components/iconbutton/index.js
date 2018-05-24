import React, { Component }from 'react';
import Button from '../button';
import Pencil from '../icons/pencil.js';
import Eye from '../icons/eye.js';
import Singelarrow from '../icons/singelarrow.js';
import Doublearrow from '../icons/doublearrow.js';
import Plus from '../icons/plus.js';
import './iconbutton.css';

class Iconbutton extends Component {
  // constructor(props) {
  //   super(props)
  // }

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
      return Pencil
    }
  }

  render() {
    const {className, icon, iconClassName, ...rest } = this.props;
    const Icon = this.getIcon(icon)
    return (
      <Button {...rest}
        className={['button-icon', className].join(' ')}>
        <Icon className={iconClassName} />
      </Button>
    )
  }
}
export default Iconbutton
