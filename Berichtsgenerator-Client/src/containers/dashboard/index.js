import React, { Component } from 'react';
import Table from '../table';
import Button from '../../components/button';
import Input from '../../components/input';
import Label from '../../components/label';
import Select from '../../components/select';
import Form from '../../components/form';
import Textfield from '../../components/text-field';
import Toast from '../../components/toast';
import Popup from '../popup';
import { metadataFromuser, startImport, startNew } from '../../api';
import withData from './withData';
import withUsers from '../../utils/withUsers';
import alert from '../../utils/Alerts';
import Extendabellist from '../../components/extendabellist';

import './dashboard.css';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
      showImport: false,
      showModal: false,
      tags: '',
      title: '',
      description: '',
      api: '',
      template: this.props.templates[0] ? this.props.templates[0].id : '',
      alerts: [],
      keys: []

    }
    this.startImport = this.startImport.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.startNew = this.startNew.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.alert = alert.bind(this);
    this.addkey = this.addkey.bind(this);
    this.handleKeyChange = this.handleKeyChange.bind(this);
  }
  fetchMetadata() {
    return metadataFromuser(this.props.user.id)
  }
  componentWillReceiveProps(props) {
    if(props.templates.length > 0 && !this.state.template) {
      this.setState({
        template: props.templates[0].id
      })

    }
  }

  componentDidMount() {
    this.fetchMetadata()
    .then((json) => {
      this.setState({
        datasets: json,
      });
    })
    .catch(err => console.log(err, '---'));
  }
  addkey() {
    const {keys} = this.state;
    this.setState({
      keys: [...keys, `feld${keys.length + 1}`]
    });
  }
  openPopup() {
    this.setState({
      showModal: true
    })
  }
  closePopup() {
    this.setState({
      showModal: false
    })
  }
  startImport(e) {
    const { api, template, title, tags, description, headline, keys} = this.state;

    startImport({
      api,
      template,
      title,
      description,
      author: this.props.user.id,
      tags: tags.split(', '),
    }).then((res) => {
      this.alert(() =>
        this.setState({
          alerts: [{type: 'success',text: 'Import wurde eingereicht bitte Laden sie die Seite neu'}],
        }),
        () => this.setState({
          alerts: []
        })
      );
      this.setState({
        showModal: false,
        api: null,
        template: null,
        title: '',
        tags: '',
        description: '',
        headline: '',
        keys: []
      });
    })
    .catch((err) => {
      this.alert(() =>
        this.setState({
          alerts: [{type: 'danger', text: 'Es ist ein Fehler Aufgetreten'}]
        }),
        () => this.setState({
          alerts: []
        })
      );
    });
  }
  startNew(e) {
    const { template, title, tags, description, headline, keys} = this.state;
    const newObject = {
      template,
      title,
      description,
      author: this.props.user.id,
      tags: tags.split(', '),
      keys,
      headline
    };
    startNew(newObject).then((res) => {
      this.setState({
        showModal: false,
        api: null,
        template: null,
        title: '',
        tags: '',
        description: '',
        headline: '',
        keys: []
      });
      this.props.history.push(`/edit/${res}/1`)
    }).catch((err) => {
      this.alert(() =>
        this.setState({
          alerts: [{type: 'danger',text: 'Ein Fehler ist Aufgetreten'}],
        }),
        () => this.setState({
          alerts: []
        })
      );
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleKeyChange(e) {
    const { name, value } = e.target
    const { keys } = this.state;

    this.setState({
      keys: [...keys.filter((key) => key !== name), value]
    })
  }

  addPromisehooks(promise) {
    return new Promise((resolve, reject) => {
      promise
    });
  }

  render() {
    const { api, template, title, tags, description, keys, headline} = this.state;
    return (
      <div className='dashboard'>
        <Toast alerts={this.state.alerts} />
        <h1 className='dashboard-title'>Dashboard</h1>
        <Table rows={this.state.datasets}/>
        <Popup
          show={this.state.showModal}
          title={!api ? 'Neuen Datensatz anlegen' : 'Importieren'}
          saveLabel={!api ? 'Anlegen' : 'Import starten'}
          closeLabel='Abbrechen'
          save={!api ? this.startNew : this.startImport}
          close={this.closePopup}>
            <Form className='form--scroll' method="POST" action="/api/import/" onSubmit={(e) => e.preventDefault()}>
              <Label text='Title*'>
                <Input onChange={this.handleChange} name='title' type='text' />
              </Label>
              <Label text='Schlagworte'>
                <Input onChange={this.handleChange} name='tags' type='text' />
              </Label>
              <Label text='Beschreibung'>
                <Input onChange={this.handleChange} name='description' type='text' />
              </Label>
              <Label text='Vorlage' />
              <Select values={this.props.templates} value={template} onChange={this.handleChange} name='template' />
              <Label text='Daten importieren von' />
              <Select empty values={this.props.apis} value={api} onChange={this.handleChange} name='api' />
              {!api ? (
                <div>
                  <Label text='Kopfzeile'>
                    <Input value={headline} onChange={this.handleChange} name='headline' type='text' />
                  </Label>

                  <div className='dashboard-popup-keys'>
                    <Label text='Vorlagen Felder' />
                    <Extendabellist className='dashboard-popup-keys-list' addkey={this.addkey} keys={keys} handleChange={this.handleKeyChange}></Extendabellist>
                  </div>
                </div>
              ) : ''}
            </Form>
          </Popup>
          <div className='detailansicht-actionsbar'>
            <div className="detailansicht-actions">
              <Button onClick={this.openPopup} className='button--default'><Textfield className='textfield--lables'>Neu</Textfield></Button>
            </div>
          </div>
      </div>
    );
  }
}

export default withUsers(withData(Dashboard));
