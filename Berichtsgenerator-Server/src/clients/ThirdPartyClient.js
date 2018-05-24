const axios = require('axios');
module.exports = class ThirdpartyClient {
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
      this.instance.get('/apis')
      .then((response) => {
        resolve(response.data);
      })
      .catch(err => reject({status: 204, error: err }));
    });
  }

  fetch(id) {
    return new Promise((resolve, reject) => {
      this.instance.post(`/fetch/${id}`)
        .then((response) => resolve(Object.assign({}, response.data, { tags: ['imported']})))
        .catch((err) => reject(err))
    });
  }
}
