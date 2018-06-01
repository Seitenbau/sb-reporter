const berichtsgenerator = require('./Berichtsgenerator-Server').factory;
const generator = require('./Generator-Service');
const thirdparty = require('./Third-Api-Service');
const config = Object.assign({}, require('./config'), {ENV: process.env.NODE_ENV});



Promise.all([
  berichtsgenerator(config),
  generator(config),
  thirdparty(config),
])
.then((result) => {
  console.log(`Running in ${process.env.NODE_ENV === 'dev' ? 'DEVELOPMENT' : 'BUILD'} mode`);
  console.log(result.map((item)  => `${item.name} => ${item.status}`).join('\n'));
})
.catch((err) => console.log(err));
