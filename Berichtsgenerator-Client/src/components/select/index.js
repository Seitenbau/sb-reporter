import React, { Component } from 'react';
import Button from '../../components/button';
import Input from '../../components/input';
import Label from '../../components/label';
import Icon from '../../components/icons';
import Textfield from '../../components/text-field';
import './select.css';

class Select extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
      open: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      selected: nextProps.value
    })
  }
  handleClick(e) {
    this.setState({
      open: !this.state.open
    });
  }
  handleChange(e) {
    this.props.onChange(e);
    e.preventDefault();
    this.setState({
      selected: e.target.value,
      open: false,
    });
  }
  getName(id) {
    const filtered = this.props.values.filter((value) => value.id.toString() === id.toString());
    return filtered.length === 0 ? {name: '-'} : filtered[0];
  }

  render() {
    // const label = (this.state.selected ? this.getName(this.state.selected).name : '-');
    return (
      this.props.values.length > 0 ?
        <div className='select'>
          <Button onClick={this.handleClick} className='select-button button--default button--full-width'>
            <Textfield className='textfield--padded'>{this.getName(this.state.selected).name}</Textfield>
            <Icon className='icon--white icon--width icon--rotated-quater icon--padded' icon='SINGEL'></Icon>
          </Button>
          <ul className={`select-values ${this.state.open ? 'select-values--open' : ''}`}>
            {this.props.empty ? (
              <li className='select-choice'>
                <Input tabIndex="1"  id="null-value" checked={null === this.state.selected} className='select-value-input' name={this.props.name} type="radio" value={null} onChange={this.handleChange} />
                <Label htmlFor="null-value" text={'-'} className='select-value' />
              </li>
            ): ''}
            {this.props.values.map((value, i) =>
              <li className='select-choice'>
                <Input id={`select-value-input-${value.id}`} checked={value === this.state.selected} className='select-value-input' name={this.props.name} type="radio" value={value.id} onChange={this.handleChange} />
                <Label htmlFor={`select-value-input-${value.id}`} key={i} text={value.name} className='select-value' />
              </li>)}
          </ul>
        </div> : ''
    );
  }
}

export default Select;
