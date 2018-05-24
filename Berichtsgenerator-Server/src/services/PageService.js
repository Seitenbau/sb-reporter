const Page = require('../models/Page');
const mongo = require('mongodb');

/**
* PageService handls actions on Page Collection
*/
module.exports = class PageService {
  constructor(MongoClient) {
    MongoClient().then((db) => {
      this.db = db;
      this.db.listCollections().toArray((err, collInfos) => {
        if(collInfos
        .map((collection) => collection.name)
        .indexOf('pages') === -1) {
          console.log('crating scheme [pages]');
          this.db.createCollection('pages');
        }
      })

      this.collection = this.db.collection('pages');
    }).catch((err) => console.log(err));
  }
/**
* returns a page with a given id and defined keys
* @param pageid STRING id from an page
* @param keys ARRAY STRING keys the page has
* @return PAGE|UNDEFINED the page to the id
*/
  fetchPage(pageid, keys) {
    return new Promise((resolve, reject) => {
      this.collection.findOne({
        _id: mongo.ObjectID(pageid)}, (err, page) => {
          if(err) return reject(err);
          return resolve(new Page(keys, page))
        });
    });
  }

/**
* inserts a page
* @param keys ARRAY STRING keys the page has
* @param page PAGE the page to be inserted
* @return STRING id of new/inserted page
*/
  insert(keys, page) {
    return new Promise((resolve, reject) => {
      this.collection.insert(new Page(keys, page).get(), (err, inserted) => {
        if (err) return reject(err);
        resolve(inserted.ops[0]._id)
      })
    });
  }


/**
* updates a page
* @param page PAGE a page which replaces one other in th DB
* @return result of replace action
*/
  save(page) {
    return new Promise((resolve, reject) => {
      this.collection.replaceOne({
        _id: mongo.ObjectID(page.id)
      },
      new Page(Object.keys(page).filter((key) => key !== 'id'), page).get(),
      {
        upsert: true
      },
      (err, res) => {
        if(err) return reject(err);
        console.log(res);
        resolve(res)
      })
    });
  }
/**
* calls save for multiple Pages
* @param pages ARRAY PAGES
* @return result of replace action´s
*/
  saveMultiple(pages) {
    return Promise.all(pages.map(page => this.save(page)));
  }
}
