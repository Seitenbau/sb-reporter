const axios = require('axios');
module.exports = class GenaratorClient {
  constructor(client) {
    this.instance = axios.create({
      baseURL: `${client.url}:${client.port}`,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  get() {
    return new Promise((resolve, reject) => {
      this.instance.get('/templates').then(response => {
        resolve(response.data);
      }).catch(err => {
        reject(err);
      });
    });
  }

  create(metadataPromise, filename) {
    return new Promise((resolve, reject) => {
      metadataPromise
        .then((metadata) => metadata.getBuild()
          .then(({ data, template }) => {
            this.instance.post(
              `/templates/genarate/${template}`,
              JSON.stringify({
                data,
                filename
              }),
              {
                headers: {
                  'Accept': 'application/pdf',
                  'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
              })
            .then((response) => {
              resolve(response.data)
            })
            .catch((err) => reject(err));
          }).catch(err => reject(err)));
    });
  }
}
