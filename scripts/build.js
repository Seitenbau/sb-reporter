const exec = require('child_process').exec;
const rmAsync = require('./rmAsync');

rmAsync('./build/', () =>{
  Promise.all([
    new Promise(function(resolve, reject) {
      console.log('BUILD: Berichtsgenerator-Server');
      exec('webpack', {
        cwd: './Berichtsgenerator-Server'
      }, (err, stdout, stderr) => {
        if(err) reject(err)
        else if(stderr) reject(stderr)
        else resolve(stdout)
      })
    }),
    new Promise(function(resolve, reject) {
      console.log('BUILD: Generator-Service');
      exec('webpack', {
        cwd: './Generator-Service'
      }, (err, stdout, stderr) => {
        if(err) reject(err)
        else if(stderr) reject(stderr)
        else resolve(stdout)
      })
    }),
    new Promise(function(resolve, reject) {
      console.log('BUILD: Third-Api-Service');
      exec('webpack', {
        cwd: './Third-Api-Service'
      }, (err, stdout, stderr) => {
        if(err) reject(err)
        else if(stderr) reject(stderr)
        else resolve(stdout)
      })
    }),
    new Promise(function(resolve, reject) {
      console.log('BUILD: Berichtsgenerator-Client');
      exec('yarn build', {
        cwd: './Berichtsgenerator-Client'
      }, (err, stdout, stderr) => {
        if(err) reject(err)
        else if(stderr) reject(stderr)
        else {
          exec('mv ./Berichtsgenerator-Client/build/* ./build/BerichtsgeneratorServer/')
        }
        resolve(stdout)
      })
    })
  ]).then(results => {
    results.forEach(res => console.log(res));
  }).catch(err => console.error(err));
});
