const mongo = require('mongodb');
module.exports = class Page {
  constructor(keys, page = {}) {
    this.id = page._id ? page._id.toString() : page.id;
    keys.forEach((key) => {
      this[key] = page[key] ? page[key] : '';
    })
  }

  get() {
    return JSON.parse(JSON.stringify(Object.assign({}, this, { id: null })));
  }
}
