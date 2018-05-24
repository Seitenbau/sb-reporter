import React, {Component} from 'react';
import Iconbutton from '../iconbutton';
import Label from '../label';
import Input from '../input';

class Extendabellist extends Component {

  render() {
    const { className } = this.props;
    return(
      <div className={['editieransicht--flex-item editieransicht--flex-item-grow', className].join(' ')}>
        {this.props.keys.map((key, i) =>
          <div key={i} className='editieransicht-pages-field'>
            <Label for={`key-name-${i}`} text='Seite.' />
            <Input onChange={this.props.handleChange} name={`${key}`} id={`key-name-${i}`} type='text' value={key} />
          </div>
        )}
        <Iconbutton icon='PLUS' onClick={this.props.addkey} ></Iconbutton>
      </div>
    );
  }
}

export default Extendabellist;
