const Server = require('./src/Server');
const config = require('./config');

module.exports = function(pubConf) {
  return new Promise((resolve, reject) => {
    new Server(Object.assign({}, pubConf, config), () => resolve({name: 'generator-service', status: 'OK'}));
  });
}
