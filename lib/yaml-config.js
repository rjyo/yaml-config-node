var yaml = require('yaml')
  , fs   = require('fs')
  , Log  = require('log')
  , log  = new Log(Log.INFO);

var extend = function(dest, from) {
  var props = Object.getOwnPropertyNames(from);
  props.forEach(function(name) {
    if (name in dest && typeof dest[name] == 'object') {
      extend(dest[name], from[name]);
    } else {
      var destination = Object.getOwnPropertyDescriptor(from, name);
      Object.defineProperty(dest, name, destination);
    }
  });
};

var readConfig = function(config_file, env) {
  if (!env) {
    env = process.env.NODE_ENV || 'development';
  }
  log.debug('Using %s environment.', env);

  try {
    var contents = fs.readFileSync(config_file);
    var config = yaml.eval(contents.toString());

    var settings = config['default'] || {};
    var settings_env = config[env] || {};

    extend(settings, settings_env);

    log.debug('Settings: %s', JSON.stringify(settings));
    return settings;
  } catch(e) {
    log.error(e);
    return {};
  }
}

module.exports.readConfig = readConfig;
