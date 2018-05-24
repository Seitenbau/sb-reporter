const Server = require('../src/Server');
const config = require('../config');
const sinon = require('sinon');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;

chai.use(chaiHttp);

describe('Server', () => {
  let server = null;

  beforeEach(() => {
    server = new Server(config, () => {});
  });
  afterEach(() => {
    server.server.close()
    server = null;
  });

  it('should be a class', () => {
    expect(server instanceof Server).to.be.true;
  });

  it('should have propertys', () => {
    expect(server).to.have.property('authentificationService');
    expect(server).to.have.property('userService');
    expect(server).to.have.property('metadataService');
    expect(server).to.have.property('pageService');
    expect(server).to.have.property('app');
    expect(server).to.have.property('thirdPartyClient');
    expect(server).to.have.property('genaratorClient');
  });

  describe("request on ", () => {
    let requester;
    beforeEach(() => {
      requester = chai.request(server.app)
    });

    afterEach(() => {
      requester.close();
    });

    it('"/" should return a html', (done) => {
      requester.get('/').then((response) => {
        expect(response).to.have.header('content-type', 'text/html; charset=UTF-8');
        done();
      }).catch(done);
    });

    it('"/api/users" should return 401', (done) => {
      requester.get('/api/users').then((response) => {
        expect(response).to.have.status(401);
        done();
      }).catch(done);
    });
  })
});
