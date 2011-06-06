// $ cd examples; node run.js
var config = require('..');
var env = process.env.NODE_ENV || 'development';

var settings = config.readConfig('app.yaml'); // path from your app root without slash
console.log('env = %s', env);
console.log(settings); // if NODE_ENV is development, prints 1

env = 'test'
settings = config.readConfig('app.yaml', env);
console.log('env = %s', env);
console.log(settings);

env = 'production'
settings = config.readConfig('app.yaml', env);
console.log('env = %s', env);
console.log(settings);

