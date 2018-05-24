import React, { Component } from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import Textfield from '../../components/text-field';
import TableHead from '../../components/tableHead';
import TableRow from '../../components/tableRow';
import TableField from '../../components/tableField';
import Iconlink from '../../components/iconlink';
import { Consumer } from '../../utils/usersContext.js';
import './table.css';

class Table extends Component {

  getAuthor(users, set) {
    if(users.length === 0) return ' - ';

    const user = users.filter(user => user.id === set.author)[0]
    return `${user.name.charAt(0).toUpperCase() + user.name.slice(1)} ${user.surname.charAt(0).toUpperCase() + user.surname.slice(1)}`;
  }
  getDate(date) {
    return moment(date).format('DD.MM.YYYY hh:mm');
  }

  render() {
    const {
      location
    } = this.props;
    return (
      <Consumer>
        { users => (
          <div className='table'>
            <TableRow className="table-header">
              <TableHead><Textfield className='textfield--ellipsis textfield--padded'>Title</Textfield></TableHead>
              <TableHead><Textfield className='textfield--ellipsis textfield--padded'>Ersteller</Textfield></TableHead>
              <TableHead><Textfield className='textfield--ellipsis textfield--padded'>Schlagworte</Textfield></TableHead>
              <TableHead><Textfield className='textfield--ellipsis textfield--padded'>zuletzt geändert am</Textfield></TableHead>
              <TableHead><Textfield className='textfield--ellipsis textfield--padded'>Funktionen</Textfield></TableHead>
            </TableRow>
            <div className='table-body'>
              {this.props.rows.map((set, i) =>
                <TableRow key={i}>
                  <TableField><Textfield className='textfield--ellipsis textfield--padded'>{set.title}</Textfield></TableField>
                  <TableField><Textfield className='textfield--ellipsis textfield--padded'>{this.getAuthor(users, set)}</Textfield></TableField>
                  <TableField><Textfield className='textfield--ellipsis textfield--padded'>{set.tags.join(', ')}</Textfield></TableField>
                  <TableField><Textfield className='textfield--ellipsis textfield--padded'>{this.getDate(set.lastEdit)}</Textfield></TableField>
                  <TableField className='table-link-field'>
                    <Iconlink className='button--clear' icon='EYE' to={{
                      pathname: `/details/${set.id}/1`,
                      state: {
                        from: location.pathname
                      }
                    }}>Detailansicht</Iconlink>
                    <Iconlink className='button--clear' icon='PENCIL' to={{
                      pathname: `/edit/${set.id}/1`,
                      state: {
                        from: location.pathname
                      }
                    }}>Detailansicht</Iconlink>
                  </TableField>
                </TableRow>
              )}
            </div>
          </div>)
        }
      </Consumer>
    );
  }
}

export default withRouter(Table);
