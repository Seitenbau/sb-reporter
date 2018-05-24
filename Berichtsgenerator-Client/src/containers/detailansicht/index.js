import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import moment from 'moment';
import Textfield from '../../components/text-field';
import Button from '../../components/button';
import Form from '../../components/form';
import { Consumer } from '../../utils/usersContext.js';
import Pagination from '../pagination';
import './detailansicht.css';
import { metadata, genaratePDF } from '../../api';
import Popup from '../popup';
import Input from '../../components/input';
import Label from '../../components/label';
import alert from '../../utils/Alerts';
import Toast from '../../components/toast';

class Detailansicht extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      pageIndex: Number.parseInt(this.props.match.params.page, 10) - 1,
      dataset: {
        tags: []
      },
      documents: [],
      page: {},
      alerts: [],
      show: false,
      filename: '',
    }

    this.genaratePDF= this.genaratePDF.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.alert = alert.bind(this);
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
    return metadata(this.state.id);
  }

  genaratePDF() {
    const {filename, id} = this.state;

    if(filename !== '')  {
      genaratePDF(id, filename)
      .then((blob) => new Promise((resolve, reject) => {
        resolve(blob);
      })).then((blob) => {
        const objctUrl = URL.createObjectURL(blob)
        this.setState({
          href:objctUrl
        }, () => {
          new Promise((resolve, reject) => {
            resolve(this.myRef.click());
          }).then(() => {
            setTimeout(() => {
              URL.revokeObjectURL(objctUrl);
            }, 100);
          });
          this.closePopup();
        });
      });
    } else {
      this.alert(() =>
        this.setState({
          alerts: [{type: 'danger', text: 'Dateiname ausfüllen'}]
        }),
        () => this.setState({
          alerts: []
        })
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    const index = Number.parseInt(nextProps.match.params.page, 10) - 1;
    const { documents } = this.state;
    this.setState({
      pageIndex: index,
      page: documents[index],
    });
  }
  componentDidMount() {
    const { pageIndex } = this.state;
    this.fetchMetadata().then((json) => {
      this.setState({
        dataset: json,
        documents: json.documents,
        page: json.documents[pageIndex]
      });
    })
    .catch(() => {
      this.setState({
        alerts: ['Ein fehler ist aufgetreten']
      });
    });
  }

  openPopup() {
    this.setState({
      show: true
    });
  }

  closePopup() {
    this.setState({
      show: false
    });
  }
  handleChange(e) {
    this.setState({
      filename: e.target.value.replace(' ', '_')
    })
  }

  render() {
    const {dataset, pageIndex, id, page, href, filename} = this.state;
    const {history, location} = this.props;
    const keys = Object.keys(page);

    return (
      <div className='detailansicht'>
        <Toast alerts={this.state.alerts} />
          <Link className={'button button-text-center button--blue button--fly'} to={location.state ? location.state.from : '/'}>zurük</Link>
          <h1 className='detailansicht-title'>Detailansicht ({dataset.headline})</h1>
        <Consumer>
          {users =>
            <div className='detailansicht-perspectiv'>
              <div className='detailansicht-metadata'>
                <div className='detailansicht-metadata-field'>
                  <Textfield className="textfield--lables textfield--full-width">Title:</Textfield>
                  <Textfield className='textfield--full-width'>{dataset.title}</Textfield>
                </div>
                <div className='detailansicht-metadata-field'>
                  <Textfield className="textfield--lables textfield--full-width">Schlagwort:</Textfield>
                  <Textfield className='textfield--full-width'>{dataset.tags.join(', ')}</Textfield>
                </div>
                <div className='detailansicht-metadata-field'>
                  <Textfield className="textfield--lables textfield--full-width">Beschreibung:</Textfield>
                  <Textfield className='textfield--full-width'>{dataset.description}</Textfield>
                </div>
                <div className='detailansicht-metadata-field'>
                  <Textfield className="textfield--lables textfield--full-width">Autor:</Textfield>
                  <Textfield className='textfield--full-width'>{this.getAuthor(users, dataset)}</Textfield>
                </div>
                <div className='detailansicht-metadata-field'>
                  <Textfield className="textfield--lables textfield--full-width">Letzte änderung:</Textfield>
                  <Textfield className='textfield--full-width'>{this.getDate(dataset.lastEdit)}</Textfield>
                </div>
              </div>
              <Pagination
                max={dataset.documents ? dataset.documents.length : 1}
                current={pageIndex + 1}
                first={() => history.push(`/details/${id}/1`)}
                last={() => history.push(`/details/${id}/${dataset.documents.length}`)}
                next={() => history.push(`/details/${id}/${pageIndex + 2}`)}
                prev={() => history.push(`/details/${id}/${pageIndex}`)}
                onInput={(value) => history.push(`/details/${id}/${Number.parseInt(value, 10) < dataset.documents.length ? value : dataset.documents.length}`)}
              />
              <div className='detailansicht-pages'>
                {keys.filter((key) => key !== 'id').map((key, i) =>
                  <div key={i} className='detailansicht-pages-field'>
                    <Textfield className="textfield--lables textfield--full-width"><i>{`Seite ${pageIndex + 1} `}</i>{key}:</Textfield>
                    <Textfield className='textfield--full-width'>{page[key] ? page[key] : '-'}</Textfield>
                  </div>
                )}
              </div>
              <div className='detailansicht-actionsbar'>
                <div className="detailansicht-actions">
                  <Button onClick={this.openPopup} className="button--clear button-text-center button-detailansicht button--blue">Export</Button>
                  <Link to={{
                    pathname: `/edit/${id}/${pageIndex + 1}`,
                    state: {
                      from: location.pathname
                    }
                  }} className='button button--clear button-text-center button-detailansicht button--default'>Editieren</Link>
                </div>
              </div>
            </div>
          }
        </Consumer>
        <Popup
          show={this.state.show}
          title={'PDF Generierung'}
          saveLabel={'PDF generierung starten'}
          closeLabel='Abbrechen'
          save={this.genaratePDF}
          close={this.closePopup}>
          <Form>
            <Label text='Dateiname'>
              <Input onChange={this.handleChange} type='text' />
            </Label>
          </Form>
        </Popup>
        <a download={`${filename}.pdf`} className='anchor--hidden' href={href} ref={e => this.myRef = e} >hidden Link for downloading PDF</a>
      </div>
    );
  }
}

export default withRouter(Detailansicht);
