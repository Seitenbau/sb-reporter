const Server = require('./src/Server');
const MongoClient = require('./src/MongoClient');
const config = require('./config');

function factory(pubConfig) {
  return new Promise(function(resolve, reject) {
    MongoClient().then((client) => {
      new Server(Object.assign({}, pubConfig, config), () => resolve({name: 'generator', status: 'OK'}));
    })
    .catch((err) => console.log(err));
  });
}

module.exports.factory = factory;

module.exports.default = (function () {
  return factory();
});
