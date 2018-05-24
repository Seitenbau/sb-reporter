const axios = require('axios');
const querystring = require('querystring');
/**
* the Client doing calls against API´S and Providing funktions
*  @param api API {name, id, baseURL, transformer, contentType }
*/
class Client {
  constructor(api) {
    this.api = api;
    this.instance = this.create();
  }

  /**
  * returns a Promise wrapping an Request calling the provided API.
  * @param params JSON a params-object added to the call
  * @return Promise {rejects: [error from Api, 415], resolves: 200 + data}
  */
  fetch(params = {}) {
    return new Promise((resolve, reject) => {
      console.log(this.api, '////');
      axios.get(this.api.endpoint, querystring.stringify(params))
        .then((res) => {
          if(this.api.contentType && res.headers['content-type'] !== this.api.contentType) {
            return reject({
              status: 415,
              message: 'Unexpected Content'
            });
          }
          return resolve(res.data);
        })
        .catch((err) => {
          console.log(err, '--');
          if(err.config.baseURL === '') {
            return reject({
              message: 'baseURL is undefined',
              status: err.response.status
            });
          }
          reject(err);
        });
    });
  }
  /**
  * normilizes Extension if no Protokoll is set or starts with '/''
  * @param extension STRING extension or URL
  * @return STRING normilized extension or URL
  */
  normilizeExtension(extension) {
    if(extension !== '' || !/^(https:\/\/)|^(http:\/\/)|^(\/)/.test(extension)) {
      return '/' + extension;
    }
    return extension;
  }
  /**
  * creates an axios-instance using the base-URL
  * @return AXISOS-INSTANCE
  */
  create() {
    return axios.create({
      baseURL: this.api.endpoint,
      headers: this.api.headers ? this.api.headers : undefined,
    });
  }
}


module.exports = Client;
