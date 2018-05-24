const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const AuthentificationService = require('./services/AuthentifikationService');
const UserService = require('./services/UserService');
const MetadataService = require('./services/MetadataService');
const PageService = require('./services/PageService');
const ThirdpartyClient = require('./clients/ThirdPartyClient');
const GenaratorClient = require('./clients/GenaratorClient');
const path = require('path');
const MongoClient = require('./MongoClient');

class Server {
  constructor(config, callback) {
    this.authentificationService = new AuthentificationService(config.secret);
    this.userService = new UserService(MongoClient);
    this.metadataService = new MetadataService(MongoClient);
    this.pageService = new PageService(MongoClient);
    this.app = express();
    this.thirdPartyClient = new ThirdpartyClient(config['third-api-service']);
    this.genaratorClient = new GenaratorClient(config['genarator-service']);

    this.app.set('trust proxy', 1);
    this.app.set('etag', false);

    this.app.use(express.static(path.resolve(__dirname, '../../Berichtsgenerator-Client/build/')));
    this.app.use(cookieParser());
    this.app.use(bodyParser.json());


    this.app.use((req, res, next) => {
      res.setHeader('Content-Type', 'application/json');
      if(config.ENV == 'dev') {
        res.setHeader('Access-Control-Allow-Origin', config['berichtsgenerator-client'].url);
      }
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT, DELETE');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-TOKEN, X-Correlation-ID'
      );
      res.setHeader('Access-Control-Allow-Credentials', true);
      next();
    });

    this.app.all('*', (req, res, next) => {
      console.log(`BERICHTSGENERATOR: ${req.method.toUpperCase()}: ${req.url}`);
      next();
    });


    this.app.get('/', (req, res) => {
      res.set({
        'Content-Type': 'text/html'
      }).sendFile(path.resolve(__dirname, '../../Berichtsgenerator-Client/build/index.html'))
    });

    this.app.post('/login', (req, res) => {
      this.authentificationService
      .isUser(req.body)
      .then((user) => {
        delete user.password;
        res
        .status(200)
        .cookie(
          'BERICHTSGENERATOR',
          this.authentificationService.createToken(user.username),
          { httpOnly: true, path: '/api', expires: new Date(Date.now() + 90000000000000) }
        )
        .send(Object.assign({}, user, {'CSRF-TOKEN': this.authentificationService.createCSRFToken(user)}))
        .end();
      })
      .catch((err) => res.status(401).send(err));
    });

    this.app.get('/logout', (req, res) => res.clearCookie('BERICHTSGENERATOR').end());

    this.app.all('/api/*', (req, res, next) => {
      if(req.method === 'GET') return next();
      if( req.cookies === {} || typeof req.cookies['BERICHTSGENERATOR'] === 'undefined') {
        res.sendStatus(401).end();
      }
      this.authentificationService
        .decodeToken(req.cookies['BERICHTSGENERATOR'])
        .then((jwt) => {
          next();
        })
        .catch(err => res.status(400).send(err));
    });
    this.app.all('/api/*', (req, res, next) => {
      if(req.method === 'GET') return next();
      this.authentificationService.verifyRequest(req)
        .then((data) => next())
        .catch((err) => res.sendStatus(err.status));
    });

    this.app.get('/api/metadata/all', (req, res) => {
      this.metadataService.fetchFromAuthor(req.query.uid)
        .then((data) => {
          res.status(200).send(data);
        })
        .catch((err) => res.status(400).send(err));
    });

    this.app.get('/api/metadata/:id', (req, res) => {
      this.metadataService.fetch(req.params.id)
        .then((data) => {
          res.status(200).send(data);
        })
        .catch((err) => res.status(400).send(err));
    });

    this.app.put('/api/metadata/:id', (req, res) => {
      const documents = req.body.documents;
      req.body.documents = req.body.documents.map((doc) => doc.id);
      Promise.all([
        this.pageService.saveMultiple(documents),
        this.metadataService.save(req.body)
      ])
      .then(() => {
          res.send().end();
      })
      .catch((e) => {
        res.send(e).status(400).end();
      });
    });

    this.app.get('/api/metadata/:id/page/:page', (req, res) => {
      this.metadataService
        .fetch(req.params.id)
        .then((metadata) => {
          this.pageService
            .fetchPage(metadata.documents[req.params.page], metadata.keys)
            .then((page) => {
              res.send(page);
            })
            .catch(err => res.status(400).end(err))
        })
        .catch(err => res.status(400).end(err))
    });

    this.app.get('/api/users', (req, res) => {
      this.userService
        .getAlluser()
        .then((data) => {
          delete data.password;
          res.send(data)
        })
        .catch((err) => res.status(401).send(err));
    });

    this.app.get('/api/third-partys', (req, res) => {
      this.thirdPartyClient.get()
      .then((data) => {
        res.send(data);
      })
      .catch(err => res.status(err.status).send(err))
    });

    this.app.get('/api/genarate/templates', (req, res) => {
      this.genaratorClient.get().then((data) => {
        res.send(data);
      })
      .catch(err => res.status(err.status).send(err))
    });

    this.app.post('/api/genarate/:id', (req, res) => {
      this.genaratorClient.create(this.metadataService.fetch(req.params.id), req.body.filename)
      .then((data) => {
        res.setHeader('Content-Type', 'application/octet-stream');
        res.send(data);

      }).catch(err => err)
    });

    this.app.post('/api/import', (req, res) => {
      if(!req.body.title) {
        res.sendStatus(400).end();
        return
      }
      res.sendStatus(202).end();
      this.thirdPartyClient.fetch(req.body.api).then((data) => {
        const documents = data.documents;
        const tags = data.tags;
        Promise.all(documents.map((doc) => this.pageService.insert(data.keys, doc)))
          .then((ids) => {
            this.metadataService.insert(Object.assign({}, data, req.body, { documents: ids, tags: tags.concat(req.body.tags)}))
          })
      }).catch((err) => {
        console.log(err);
      })
    });

    this.app.post('/api/new', (req, res) => {
      if(!req.body.title) {
        console.log(req.body);
        res.sendStatus(400).end();
        return
      }
      this.pageService.insert(req.body.keys, {})
        .then((id) => {
          this.metadataService.insert(Object.assign({}, req.body, { documents: [id] }))
          .then((data) => {
            console.log(data);
            res.send(data).status(200).end();
          })
        })
      .catch((err) => {
        console.log(err);
      })
    });

    this.app.post('/api/new/:id/page', (req, res) => {
      this.metadataService
        .fetch(req.params.id).then((data) => {
          this.pageService.insert(data.keys, {}).then((id) => {
            const documents = data.documents.map((doc) => doc.id);
            documents.push(id);
            this.metadataService.save(Object.assign({}, data, {documents}))
            .then(() => res.send(id.toString()))
          })
        }).catch(err => res.sendStatus(400));
    })


    this.server = this.app.listen(config.port ? config.port : config['berichtsgenerator-server'].port, callback);
  }
}

module.exports = Server;
