import React, {Component} from 'react';
import Button from '../button';
import './togglebutton.css';

class Togglebutton extends Component {
  render() {
    return (
      <div className='toggle'>
        <Button onClick={() => this.props.getContext(true)} className={`button-toggle button--default ${this.props.active ? 'button-toggle-active' : 'button-toggle-deactive'}`}>{this.props.primary}</Button>
        <Button onClick={() => this.props.getContext(false)} className={`button-toggle button--default ${!this.props.active ? 'button-toggle-active' : 'button-toggle-deactive'}`}>{this.props.secondary}</Button>
      </div>
    )
  }
}
export default Togglebutton
