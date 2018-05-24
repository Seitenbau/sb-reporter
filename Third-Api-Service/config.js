const jiraTransfomer = require('./transformers/jira-transformer.js');
const govTransfomer = require('./transformers/gov-transformer.js');
const govTransfomer2 = require('./transformers/gov-transformer2.js');

module.exports = {
  port: 3003,
  apis:[{
    id: 1,
    name: 'JIRA',
    endpoint: 'https://jira.dev.seitenbau.net/',
    contentType: 'application/json',
    headers: {},
    transformer: jiraTransfomer,
  },
  {
    id: 2,
    name: 'Test daten Transformer',
    endpoint: 'https://geo.sv.rostock.de/download/opendata/bevoelkerungsstruktur_2015/bevoelkerungsstruktur_2015_insgesamt.json',
    contentType: 'application/json',
    headers: {},
    transformer: govTransfomer,
  },
  {
    id: 3,
    name: 'bevoelkerungsstruktur 2015',
    endpoint: 'https://geo.sv.rostock.de/download/opendata/vornamen_von_neugeborenen_2015/vornamen_von_maennlichen_neugeborenen_2015.json',
    contentType: 'application/json',
    headers: {},
    transformer: govTransfomer2
  }]
};
