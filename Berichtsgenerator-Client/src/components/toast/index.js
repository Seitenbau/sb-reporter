import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Textfield from '../text-field';
import './toast.css';

class Toast extends Component {
  render() {
    const items = this.props.alerts.map((alter, i) => <Textfield key={i} className={`textfield--full-width textfield--centered toast toast-${alter.type}`} >{alter.text}</Textfield> )
    return(
      <ReactCSSTransitionGroup
          transitionName="toast"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
          className='toasts'>
          {items}
      </ReactCSSTransitionGroup>
    )
  }
}

export default Toast
