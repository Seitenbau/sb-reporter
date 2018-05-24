import React, { Component } from 'react';
import Button from '../../components/button';
import './popup.css';

class Popup extends Component {

  render() {
    return (
      <div className={`popup-background ${this.props.show ? 'popup-visibile' : ''}`}>
        <div className='popup'>
          <div className='popup-head'>
            <h2>
              {this.props.title}
            </h2>
          </div>
          <div className='popup-body'>
            {this.props.children}
          </div>
          <div className='popup-footer'>
            <Button className='popup-close-button button--red' onClick={this.props.close}>{this.props.closeLabel}</Button>
            <Button className='popup-close-button button--green' onClick={this.props.save}>{this.props.saveLabel}</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Popup;
