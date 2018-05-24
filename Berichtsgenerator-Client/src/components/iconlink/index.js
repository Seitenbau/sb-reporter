import React, { Component }from 'react';
import { Link } from 'react-router-dom';
import Pencil from '../icons/pencil.js';
import Eye from '../icons/eye.js';
import Singelarrow from '../icons/singelarrow.js';
import Doublearrow from '../icons/doublearrow.js';
import Plus from '../icons/plus';
import './iconlink.css';

class Iconlink extends Component {
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
      return () => {}
    }
  }

  render() {
    const {className, icon, iconClassName, ...rest } = this.props;
    const Icon = this.getIcon(icon)
    return (
      <Link {...rest}
        className={['button', 'button-icon', className].join(' ')}>
        <Icon className={iconClassName} />
      </Link>
    )
  }
}
export default Iconlink
