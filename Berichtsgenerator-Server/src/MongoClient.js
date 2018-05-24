const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

module.exports = function() {
  const {url, username, password, database} = config.db;
  return new Promise(function(resolve, reject) {
    MongoClient.connect(`mongodb://${username}:${password}@${url}/${database}`, (err, client) => {
      if(err) return reject(err);
      return resolve(client.db(database));
    });
  });
};
