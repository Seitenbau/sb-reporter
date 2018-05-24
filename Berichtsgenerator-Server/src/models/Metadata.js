const mongo = require('mongodb');
const moment = require('moment');
const MongoClient = require('../MongoClient');

const UserService = require('../services/UserService');

const userService = new UserService(MongoClient);

module.exports = class Metadata {
  constructor({_id, title, author, description, lastEdit = Date.now(), headline, tags, documents, keys, template = 1 }) {
    this.id = _id ? _id.toString() : undefined;
    this.title = title;
    this.author = author;
    this.description = description;
    this.lastEdit = lastEdit;
    this.headline = headline;
    this.tags = tags;
    this.documents = documents;
    this.keys = keys;
    this.template = template
  }

  get() {
    return JSON.parse(JSON.stringify(Object.assign({},this, { id: null })));
  }

  getBuild() {
    return new Promise((resolve, reject) => {
      Promise.all([
        userService.getUserById(this.author),
      ]).then((data) => {
        resolve({
          data: {
            title: this.title,
            author: data[0],
            description: this.description,
            lastEdit:  moment(this.lastEdit).format('DD.MM.YYYY hh:mm'),
            headline: this.headline,
            tags: this.tags,
            documents: this.documents,
          },
          template: this.template
        });
      });
    });
  }
}
