const child_process = require('child_process');

child_process.spawn('yarn build', {}, {
  cwd: '../Berichtsgenerator-Client'
}, (data) => {
  console.log(data);
})
