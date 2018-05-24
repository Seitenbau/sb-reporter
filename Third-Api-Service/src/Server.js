const express = require('express');
const Mapper = require('api-mapping-service');

const bodyParser = require('body-parser');
const Client = require('./Client');
const ApiCollection = require('./models/ApiCollection');

/**
* the Server-Class defining the the Interfaces
* @param config NUMBER port to listen
*/
class Server {
  constructor(config, callback) {
    this.apis = new ApiCollection(config.apis);
    this.app = express();
    this.app.use(bodyParser.json());

    this.app.all('*', (req, res, next) => {
      console.log(`THIRDAPICLIENT: ${req.method.toUpperCase()}: ${req.url}`);
      next();
    });

    /**
    * Healt Status of API-Service just return 200 to note Server is started
    */
    this.app.get('/health', (req, res) => {
      res.send({
        registeredApis: this.apis.length(),
      });
    });

    /**
    * returning all configured Apis
    */
    this.app.get('/apis', (req, res) => {
      if(this.apis.length === 0) {
        res.status(204).end();
      }
      res.json(this.apis.getAll());
    });

    /**
    * Fetch-endpoint, calls the provided API by id
    * @param api API the api to call,
    * @param params JSON params-Object to be send to the api in case of pagination or so
    * @param res RESPONSE the response object which returns the api-call-response
    */
    const fetch = (api, params, res) => {
      if(typeof api === 'undefined') {
        res
          .status(404)
          .send('Unknown API')
          .end();
      }
      const client = new Client(api);
      client.fetch(params).then((data) => {
        res
          .status(200)
          .send(api.transformer(new Mapper(), data))
          .end();
      }).catch((err) => {
        res
          .status(404)
          .send(err.message)
          .end();
      });
    }

    /**
    * Defining fetch with and without params
    */
    this.app.post('/fetch/', (req, res) => fetch(this.apis.defaultApi(req.body), req.query, res));
    this.app.post('/fetch/:id', (req, res) => fetch(this.apis.get(Number.parseInt(req.params.id)), req.query, res));


    this.app.post('/concat', (req, res) => {
      Promise.all(req.body.apis
        .map((apiId) =>
          new Client(this.apis.get(apiId))
            .fetch(req.query)))
      .then(values => {
        res.send(values).end();
      });
    })

    /**
    * port listner
    *
    */
    this.app.listen(config.port ? config.port : config['third-api-service'].port,  () => {
      callback();
    });

  }
}
module.exports = Server;
