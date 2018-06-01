module.exports = {
  secret: 'secret',
  db: {
    username: 'jon',
    password: '12345678',
    url: '127.0.0.1:27017',
    database: 'berichtsgenerator',
  },
  'berichtsgenerator-server': {
    port: 3006,
    url: 'http://127.0.0.1'
  },
  'third-api-service': {
    port: 3003,
    url: 'http://127.0.0.1'
  },
  'genarator-service': {
    port: 3004,
    url: 'http://127.0.0.1'
  }
}
