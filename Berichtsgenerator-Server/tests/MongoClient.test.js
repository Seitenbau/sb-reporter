const MongoClient = require('../src/MongoClient');
var chai = require('chai');
var should = chai.should();

describe('MongoClient', () => {
  it('should be a function', () => {
    MongoClient.should.be.a('function');
  });
  it('should return a promise', () => {
    MongoClient().then((db) => {
      db.should.exist();
    })
  })
});
