const UserService  = require('../../src/services/UserService');
const config = require('../../config');
const sinon = require('sinon');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var mongodb = require('mongo-mock');

xdescribe('UserService', () => {
  let service = {};

  beforeEach((done) => {
    const stub = sinon.stub().callsFake(() => new Promise(function(resolve, reject) {
      mongodb.MongoClient.connect('df', {}, function(err, db) {
        resolve(db);
        done()
      });
    }));
    service = new UserService(stub);
  });
afterEach(() => {
  service = {};
});

  it('is  a Class', () => {
    expect(typeof service).to.equal('object');
  });

  it('returns something', (done) => {
    service.getUserByName('name').then((res) => {
      console.log(res);
      done();
    }).catch(done);
  })

});
