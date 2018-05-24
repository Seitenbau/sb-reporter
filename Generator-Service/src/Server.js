const express = require('express');
const bodyParser = require('body-parser');
const TemplateCollection = require('./models/TemplateCollection');
const GeneratorService = require('./services/GenaratorService');
const TemplateService = require('./services/TemplateService');
const path = require('path');
const fs = require('fs');

class Server {
  constructor(config, callback) {
    this.app = express();
    this.app.use(bodyParser.json());
    this.templateCollection = new TemplateCollection();
    this.generatorService = new GeneratorService();
    this.templateService = new TemplateService();

    this.app.all('*', (req, res, next) => {
      console.log(`GENARATOR: ${req.method.toUpperCase()}: ${req.url}`);
      next();
    });

    this.app.get('/health', (req, res) => {
      res.sendStatus(200);
    });

    this.app.get('/templates', (req, res) => {
      res.send(this.templateCollection.getAll());
    });

    this.app.post('/templates/genarate/:id', (req, res) => {
      this.generatorService.create(
        this.templateService
        .render(
          this.templateCollection.get(req.params.id),
          req.body.data)
        .getWrappedHtml(),
      req.body.filename).then(readStream => {
        // const fileStream = fs.createReadStream(readStream);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
        readStream.pipe(res);

      }).catch((err) => res.send(err));
    })

    this.app.listen(config.port ? config.port : config['genarator-service'].port, callback)
  }
}

module.exports = Server;
