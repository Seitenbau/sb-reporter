const jwt  = require('jsonwebtoken');
const shuffle = require('shuffle-array');
const sha256 = require('sha256');
const MongoClient = require('../MongoClient');
const UserService = require('./UserService');

class Authentification {
  constructor(secret) {
    this.secret = secret;
    this.userService = new UserService(MongoClient);
  }

  verifyRequest(req) {
    return new Promise((resolve, reject) => {
      if(!this.verifyCSRFToken(req.body['CSRF-TOKEN'], req.get('X-CSRF-TOKEN'))) {
        reject({status: 403, error: 'CSRF not matching'});
      }
      this.verifyToken(req.cookies['BERICHTSGENERATOR'])
      .then(resolve)
      .catch(reject);
    });
  }

  /**
  * verifys a User exists trys to login
  * @param STRING username a username of an user whether existing or not
  * @param PASSWORD password a password of a user whether existing or not
  * @return PROMISE resolves if user exists rejects of 1) user dont exists 2) one of the credentials are wrong
  */
  isUser({username, password}) {
    return new Promise((resolve, reject) => {
      this.userService
        .getUserByUsernameAndPassword(username, password)
        .then((user) => resolve(user))
        .catch((err) => reject(err));
    });
  }

  /**
  * returns a JWT with the username as a claim
  * @param STRING username
  * @return STRING Json Web TOKEN
  */
  createToken(username) {
    return jwt.sign({
      issuer: username,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + ((60 * 60) * 10)
    }, 'secret');
  }

  /**
  * verifys a JWT
  * @param STRING token
  * @return PROMISE resolves if token is valid, rejects if an error occured
  */
  verifyToken(token) {
    return new Promise(function(resolve, reject) {
      jwt.verify(token, 'secret', (err, decoded) => {
        if(err) return reject({status: 401, error: err});
        return resolve(decoded);
      })
    });
  }

  decodeToken(token) {
    return this.verifyToken(token);
  }

  createCSRFToken(user) {
    return sha256(shuffle(user.id.split('').concat(user.username)));
  }

  verifyCSRFToken(sessionToken, postToken) {
    return sessionToken === postToken;
  }
}

module.exports = Authentification;
