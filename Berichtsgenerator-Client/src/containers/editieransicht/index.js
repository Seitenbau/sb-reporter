import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import moment from 'moment';
import Textfield from '../../components/text-field';
import Label from '../../components/label';
import Input from '../../components/input';
import Form from '../../components/form';
import Button from '../../components/button';
import Iconbutton from '../../components/iconbutton';
import Togglebutton from '../../components/togglebutton';
import { Consumer } from '../../utils/usersContext.js';
import Toast from '../../components/toast';
import { Consumer as UserConsumer } from '../../utils/auth.js';
import Pagination from '../pagination';
import { metadata, save, newPage } from '../../api';
import './editieransicht.css';
import alert from '../../utils/Alerts';
import Extendabellist from '../../components/extendabellist';

class Editieransicht extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      pageIndex: Number.parseInt(this.props.match.params.page, 10) - 1,
      dataset: {
        tags: [],
        documents: []
      },
      keys: [],
      page: {},
      alerts: [],
      documents: [],
      context: 'KONTEXT',
    };

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleValueChange = this.handleValueChange.bind(this)
    this.handleKeyChange = this.handleKeyChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleMetadataChange = this.handleMetadataChange.bind(this)
    this.savePageChanges = this.savePageChanges.bind(this)
    this.getContext = this.getContext.bind(this)
    this.handleSave = this.handleSave.bind(this);
    this.alert = alert.bind(this);
    this.addkey = this.addkey.bind(this);
    this.newPage = this.newPage.bind(this);
  }

  getAuthor(users, set) {
    if(users.length === 0) return ' - ';

    const user = users.filter(user => user.id === set.author)[0];
    if(!user) return set.author;
    return `${user.name.charAt(0).toUpperCase() + user.name.slice(1)} ${user.surname.charAt(0).toUpperCase() + user.surname.slice(1)}`;
  }
  getDate(date) {
    return moment(date).format('DD.MM.YYYY hh:mm');
  }

  fetchMetadata() {
    return metadata(this.state.id)
  }
  componentWillReceiveProps(nextProps) {
    const index = Number.parseInt(nextProps.match.params.page, 10) - 1;
    this.setState({
      pageIndex: index,
      page: this.state.documents[index],
    });
  }
  componentDidMount() {
    this.fetchMetadata().then((s) => {
      this.setState({
        dataset: s,
        documents: s.documents,
        keys: s.keys,
        page: s.documents[this.state.pageIndex]
      });
    })
  }
  handleMetadataChange(e) {
    const {name, value} = e.target
    const {dataset} = this.state;
    this.setState({
      dataset: {...dataset, ...{[name]: name === 'tags' ? value.split(', ') : value}}
    });
  }
  handleSubmit(e) {
    e.preventDefault();
  }
  handleKeyChange(e)  {
    e.preventDefault();
    const {name, value} = e.target;

    const { keys, documents, pageIndex } = this.state;

    const alteredDoc = documents.map((doc) => this.alterKeyOnSet(doc, name, value));
    const alteredKeys = keys.map((key) => key === name ? value : key);

    this.setState({
      documents: alteredDoc,
      page: alteredDoc[pageIndex],
      keys: alteredKeys
    })
  }
  handleFormSubmit(e) {
    e.preventDefault();
  }
  handleValueChange(e) {
    const { value, name } = e.target
    this.setState({
      page: Object.assign({}, this.state.page, {[name]: value})
    });
  }

  addkey() {
    const {keys} = this.state;
    this.setState({
      keys: [...keys, `feld${keys.length + 1}`]
    });
  }

  alterKeyOnSet(set, oldKey, newKey) {
      const stateValue = set[oldKey];
      delete set[oldKey]
      return Object.assign({}, set, {[newKey]: stateValue});
  }
  savePageChanges(callback) {
    const { page, documents, pageIndex } = this.state;
    documents[pageIndex] = page;
    this.setState({
      documents: documents,
    });
    callback();
  }
  getContext(active) {
    this.setState({
      context: active ? 'KONTEXT' : 'TEMPLATE'
    });
  }
  handleSave(user) {
    const {dataset, documents, id, keys} = this.state
    this.savePageChanges(() => {
      save(
          id,
          Object.assign({}, dataset, { lastEdit: undefined, keys,  documents,  'CSRF-TOKEN': user['CSRF-TOKEN']}),
          user
      ).then(() => {
        //dataset: Object.assign({}, dataset, { lastEdit: Date.now()})
        this.alert(() =>
          this.setState({
            alerts: [{type: 'success', text: 'Gespeichert'}],
          }),
          () => this.setState({
            alerts: []
          })
        );
      }).catch(err => {
        this.alert(() =>
          this.setState({
            alerts: [{type: 'danger', text: 'Fehlgeschlagen'}],
          }),
          () => this.setState({
            alerts: []
          })
        );
      })
    });
  }
  newPage(e) {
    const { keys, documents, id } = this.state;
    newPage(id).then((id) => {
      let newPage = {id};
      keys.forEach((key) => {
        newPage = {...newPage, [key]: ''}
      })
      this.setState({
        documents: [...documents, newPage]
      }, () => {
        this.props.history.push(`/edit/${id}/${documents.length + 1}`)
      });
    })

  }
  render() {
    const {dataset, pageIndex, id, page, keys, documents} = this.state;
    const {history, location} = this.props;
    return (
      <div className='editieransicht'>
        <Toast alerts={this.state.alerts} />
          <div className='editieransicht-header'>
            <h1 className='editieransicht-title'>{dataset.headline}</h1>

          </div>
        <Consumer>
          {users =>
            <div className='editieransicht-perspectiv'>
              <div className='editieransicht-head'>
                <div className='editieransicht-metadata'>
                  <div className='editieransicht-metadata-field'>
                    <Label className="textfield--lables label--text-bold" text='Title:'>
                      <Input onChange={this.handleMetadataChange} name='title' type='text' value={dataset.title} />
                    </Label>
                  </div>
                  <div className='editieransicht-metadata-field'>
                    <Label className="textfield--lables label--text-bold" text='Schlagwort:'>
                      <Input onChange={this.handleMetadataChange}  name='tags' type='text' value={dataset.tags.join(', ')} />
                    </Label>
                  </div>
                  <div className='editieransicht-metadata-field'>
                    <Label className="textfield--lables label--text-bold" text='Beschreibung:'>
                      <Input onChange={this.handleMetadataChange} name='description' type='text' value={dataset.description} />
                    </Label>
                  </div>
                  <div className='editieransicht-metadata-field'>
                    <Textfield className="textfield--lables">Autor:</Textfield><Textfield>{this.getAuthor(users, dataset)}</Textfield>
                  </div>
                  <div className='editieransicht-metadata-field'>
                    <Textfield className="textfield--lables">Letzte änderung:</Textfield><Textfield>{this.getDate(dataset.lastEdit)}</Textfield>
                  </div>
                </div>
              </div>
              <Togglebutton active={this.state.context === 'KONTEXT'} getContext={this.getContext} primary='Kontext' secondary='Vorlage' />
                {this.state.context === 'TEMPLATE' ?
                <div className='editieransicht-pages editieransicht-context'>
                  <Form onSubmit={(e) => e.preventDefault() } >
                    <Extendabellist addkey={this.addkey} keys={keys} handleChange={this.handleKeyChange} />
                  </Form>
                </div>:
                <div className='editieransicht-context'>
                  <Pagination
                    max={documents ? documents.length : 1}
                    current={pageIndex + 1}
                    first={() => this.savePageChanges(() => history.push(`/edit/${id}/1`))}
                    last={() => this.savePageChanges(() => history.push(`/edit/${id}/${documents.length}`))}
                    next={() => this.savePageChanges(() => history.push(`/edit/${id}/${pageIndex + 2}`))}
                    prev={() => this.savePageChanges(() => history.push(`/edit/${id}/${pageIndex}`))}
                    onInput={(value) => history.push(`/edit/${id}/${Number.parseInt(value, 10) < documents.length ? value : documents.length}`)}
                    rightExtraButton={(<Iconbutton icon='PLUS' iconClassName='icon--white' onClick={this.newPage} className="button--clear button--default" />)}
                  />
                  <div className='editieransicht-pages'>
                    <div className='editieransicht--flex-item editieransicht--flex-item-grow'>
                      <Form onSubmit={this.handleSubmit}>
                        {this.state.keys.map((key, i) =>
                          <div key={i} className='editieransicht-pages-field'>
                            <Label className='label--text-bold' for={`value-${key}`} text={`Seite ${pageIndex + 1} ${key}:`}>
                              <Input id={`value-${key}`} onChange={this.handleValueChange} name={`${key}`} type='text' value={page[key]} />
                            </Label>
                          </div>
                        )}
                      </Form>
                    </div>
                  </div>
                </div>
              }
              <div className='editieransicht-actionsbar'>
                <div className="editieransicht-actions">
                  <Link to={'/'}
                  className='button button--clear button-text-center button-editieransicht button--red button--box-shadow'>Abbrechen</Link>
                  <UserConsumer>
                    {user =>
                      <Button onClick={() => this.handleSave(user)} className="button--clear button-text-center button-editieransicht button--green button--box-shadow">Speichern</Button>
                    }
                  </UserConsumer>
                </div>
              </div>
            </div>
          }
        </Consumer>
      </div>
    );
  }
}

//<Textfield>:</Textfield>

export default withRouter(Editieransicht);
