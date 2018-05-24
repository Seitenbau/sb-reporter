const Server = require('./src/Server');
const config = require('./config');
/**
* Third-Pary-Service provides a interface for fetching data from
* external APIS.
*
*/
module.exports = function(pubConf) {
  return new Promise((resolve, reject) => {
    new Server(Object.assign({}, pubConf, config), () => resolve({name: 'thirdparty-service', status: 'OK'}));
  });
}
