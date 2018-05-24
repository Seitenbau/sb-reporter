class Api {
  constructor({ id, endpoint, name = '&&', contentType = 'application/json', transformer, headers}) {
    this.id = id;
    this.name = name;
    this.endpoint = endpoint;
    this.contentType = contentType;
    this.transformer = transformer ? transformer : (mapper, data) => data;
    this.headers = Object.assign({}, {
      'Content-Type': this.contentType,
    }, headers);
  }
}
module.exports = Api;
