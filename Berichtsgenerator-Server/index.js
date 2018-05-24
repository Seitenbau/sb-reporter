const Server = require('./src/Server');
const MongoClient = require('./src/MongoClient');
const config = require('./config');

module.exports = function(pubConfig) {
  return new Promise(function(resolve, reject) {
    MongoClient().then((client) => {
      new Server(Object.assign({}, pubConfig, config), () => resolve({name: 'generator', status: 'OK'}));
    })
    .catch((err) => console.log(err));
  });
}
