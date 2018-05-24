const User = require('../models/User');
const mongo = require('mongodb');

/**
* UserService handls actions on Database for Collection 'User'
*/
module.exports = class UserService {
  constructor(MongoClient) {
    MongoClient().then((db) => {
      this.db = db;
      this.db.listCollections().toArray((err, collInfos) => {
        if(collInfos
        .map((collection) => collection.name)
        .indexOf('users') === -1) {
          console.log('crating scheme [users]');
          this.db.createCollection('users');
        }
      })

      this.collection = this.db.collection('users');
    }).catch((err) => console.log(err));
  }
  /**
  * returns one User by a given Name
  * @param STRING name the name of a User
  * @return USER|UNDEFINED user found or undefined
  */
  getUserByName(name) {
    return new Promise((resolve, reject) => {
      this.collection.findOne({name: name},(err, user) => {
        if(err) return reject(err);
        return resolve(new User(user));
      });
    });
  }
  /**
  * returns one User by a given username and password
  * @param STRING name the name of a User
  * @param STRING password the password of a User
  * @return USER|UNDEFINED user found or undefined
  */
  getUserByUsernameAndPassword(username, password) {
    return new Promise((resolve, reject) => {
      this.collection.findOne({username: username, password: password},(err, user) => {
        if(err) return reject(err);
        if(user === null) return reject('No User found');
        return resolve(new User(user));
      });
    });
  }

  /** returns one user by a given id
  * @param STRING id the id of a User
  * @return USER|UNDEFINED user found or undefined
  */
  getUserById(id) {
    return new Promise((resolve, reject) => {
      this.collection.findOne({_id: mongo.ObjectID(id)}, (err, user) => {
        if(err) return reject(err);
        return resolve(new User(user));
      });
    });
  }

  /**
  * fetch al users from DataBase
  * @returns PROMISE resolves with ARRAY-OF-USER or rejects error
  */
  getAlluser() {
    return new Promise((resolve, reject) => {
      this.collection.find({})
      .toArray((err, users) => {
        if(err) return reject(err);
        return resolve(users.map((user) => new User(user)));
      });
    });
  }

  /**
  * @param USER user-Object
  * @return BOOLEAN true on success false on fail
  */
  createUser(user) {
    return new Promise((resolve, reject) => {
      this.collection.insert(new User({
        username: 'lochmann',
        name: 'lukas',
        surname: 'ochmann',
        email: 'ochmann.lukas@test.de',
        role: 'admin',
        password: '12345'
      }).get(), (err, res) => {
        if(err) return reject(err);
        return resolve(res);
      });
    });
  }
};
