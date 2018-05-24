const Api = require('./Api');
/**
* ApiCollection provids all Apis defined and servs functions on that
* @param apis JSON-ARRAY defined apis
*/
class ApiCollection {
  constructor(apis) {
    this.apis = apis.map((api, index) => new Api(api));
  }

  /**
  * returns an api-obejct
  * @param [id] NUMBER|UNDEFINED an id of one defined api ore undefined
  * @return JSON defined api-object ore dafualt-api-object
  */
  get(id) {
    if(this.length() === 0 || typeof id === 'undefined') {
      return null;
    }
    return this.apis.filter((api) => api.id == id)[0];
  }

  getAll() {
    return JSON.parse(JSON.stringify(this.apis))
  }

  /**
  * returns an dafualt-api-object for unregular use
  * @param api JSON api-object to be merged above the default object
  * @return JSON dafualt-api-object
  */
  defaultApi(api = {}) {
    return new Api(Object.assign({}, api, { baseURL: '', id: null }));
  }

  last() {
    return this.apis[this.apis.length - 1];
  }
  first() {
    return this.apis[0];
  }
  length() {
    return this.apis.length;
  }
}

module.exports = ApiCollection;
