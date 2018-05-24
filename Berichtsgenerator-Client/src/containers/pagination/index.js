import React, { Component } from 'react';
import { DebounceInput } from 'react-debounce-input';
import Iconbutton from '../../components/iconbutton'
import Textfield from '../../components/text-field';
import './pagination.css';

class Pagination extends Component {
  // constructor(props) {
  //   super(props);
  //
  // }
  render() {
    return (
      <div className='pagination'>
        {this.props.leftExtraButton ? this.props.leftExtraButton : ''}
        <Iconbutton icon='DOUBLE' iconClassName='icon--rotated icon--white' disabled={this.props.current === 1} onClick={this.props.first} className="button--clear button--default" />
        <Iconbutton icon='SINGEL' iconClassName='icon--rotated icon--white' disabled={this.props.current === 1} onClick={this.props.prev} className="button--clear button--default" />
        <DebounceInput debounceTimeout={300} onChange={(e) => this.props.onInput(e.target.value)} className='input input-pagination' value={this.props.current} />
        <Textfield className='textfield-pagination textfield-pagination-padded'> / {this.props.max}</Textfield>
        <Iconbutton icon='SINGEL' iconClassName='icon--white' disabled={this.props.current === this.props.max} onClick={this.props.next} className="button--clear button--default" />
        <Iconbutton icon='DOUBLE' iconClassName='icon--white' disabled={this.props.current === this.props.max} onClick={this.props.last} className="button--clear button--default" />
        {this.props.rightExtraButton ? this.props.rightExtraButton : ''}
      </div>
    )
  }
}

export default Pagination;
