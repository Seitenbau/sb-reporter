const Metadata = require('../models/Metadata');
const mongo = require('mongodb');
const PageService = require('./PageService');

module.exports = class MetadataService {
  constructor(MongoClient) {
    this.pageService = new PageService(MongoClient);
    MongoClient().then((db) => {
      this.db = db;
      this.db.listCollections().toArray((err, collInfos) => {
        if(collInfos
        .map((collection) => collection.name)
        .indexOf('metadata') === -1) {
          console.log('crating scheme [metadata]');
          this.db.createCollection('metadata');
        }
      })

      this.collection = this.db.collection('metadata');
    }).catch((err) => console.log(err));
  }

  fetchFromAuthor(author, sort = { lastEdit: 1 }) {
    return new Promise((resolve, reject) => {
      this.collection.find({ author })
        .toArray((err, metadatas) => {
          if(err) return reject(err);
          return resolve(metadatas.map((metadata) => new Metadata(metadata)));
        });
    });
  }
  fetch(id, sort = { lastEdit: 1 }) {
    return new Promise((resolve, reject) => {
      this.collection.findOne({ _id: mongo.ObjectID(id) }, (err, metadata) => {
        if(err) return reject(err);
        const documents = Promise.all(metadata.documents.map((doc) => this.pageService.fetchPage(doc, metadata.keys)));
        documents.then((docs) => {
          const resoleved = Object.assign({}, metadata, {
            documents: metadata.documents.map((docID) => {
              return docs.filter((doc) => doc.id === docID)[0]
            })
          });
          resolve(new Metadata(resoleved));
        }).catch((err) => {
          resolve(err);
        });
      });
    });
  }
  insert(metadata) {
    metadata = new Metadata(metadata);
    return new Promise((resolve, reject) => {
      if(!metadata instanceof Metadata) reject('not Metadata');
      this.collection.insertOne(metadata.get(), (err, res) => {
        if (err) return reject(err);
        return resolve(res.insertedId);
      })
    });
  }
  save(metadata) {
    return new Promise((resolve, reject) => {
      this.collection.update({
        _id: mongo.ObjectID(metadata.id)
      }, new Metadata(metadata).get(), (err, res) => {
        if(err) return reject(err);
        return resolve(res)
      });
    });
  }
};
