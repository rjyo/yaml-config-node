// $ cd examples; node run.js
var config = require('..')
  , path = require('path');
var env = process.env.NODE_ENV || 'development';

var settings = config.readConfig(path.join(__dirname,'app.yaml')); // path from your app root without slash
console.log('env = %s', env);
console.log(settings); // if NODE_ENV is development, prints 1

env = 'test'
settings = config.readConfig(path.join(__dirname,'app.yaml'),env);
console.log('env = %s', env);
console.log(settings);

env = 'production'
settings = config.readConfig(path.join(__dirname,'app.yaml'),env);
console.log('env = %s', env);
console.log(settings);
settings.redis.host='10.1.50.100';
config.writeConfig(settings, path.join(__dirname,'app.yaml'),env);

