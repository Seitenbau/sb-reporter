import React, { Component } from 'react';
import Button from '../button';
import './dropdown.css';

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    const { children } = this.props;
    return (
      <div className={`dropdown-menu dropdown-menu-${this.state.open ? 'open': 'close'}`}>
        <Button onClick={this.toggleMenu} className='button--clear dropdown-button'>{this.props.text}</Button>
        <ul className={ `dropdown-menu-list`}>
          {React.Children.map(children, (child, i) => (
            <li key={i} className='dropdown-menu-item'>
              {child}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Dropdown;
