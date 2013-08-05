var yaml = require('js-yaml') // register .yaml require handler
  , fs   = require('fs')
  , Log  = require('log')
  , log  = new Log(Log.INFO);

var extend = function(dest, from) {
  var props = Object.getOwnPropertyNames(from);
  props.forEach(function(name) {
    if (name in dest && typeof dest[name] === 'object') {
      extend(dest[name], from[name]);
    }
     else {
      var destination = Object.getOwnPropertyDescriptor(from, name);
      Object.defineProperty(dest, name, destination);
    }
  });
};

var complement = function(dest, from){
  var props = Object.getOwnPropertyNames(from);
  props.forEach(function(name) {
    if (name in from && typeof from[name] === 'object') {
      if(Object.keys(dest[name]).length===0 && Object.keys(from[name]).length===0){
        delete dest[name];
      } 
      else{
        complement(dest[name], from[name]);        
      }
    } else {
      if(dest[name]===from[name]){
        delete dest[name];
      }
    }
  });  
}

var readConfig = function(config_file, env) {
  if (!env) {
    env = process.env.NODE_ENV || 'development';
  }
  log.debug('Using %s environment.', env);

  try {
    var config = require(config_file);

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

var writeConfig = function(current_config, config_file, env) {
  if (!env) {
    env = process.env.NODE_ENV || 'development';
  }
  log.debug('Using %s environment.', env);

  try {
    //Reload settings from the configuration file
    var configData = fs.readFileSync(config_file, 'utf8');
    var config = yaml.safeLoad(configData);
    var settings = config['default'] || {};
    //Remove all properties from the current configuration that exist
    //in the default AND is equal to the default value
    complement(current_config,settings);
    //Update the values in the configuration
    extend(config[env], current_config);
    var output =  yaml.safeDump(config,config.CORE_SCHEMA);
    fs.writeFileSync(config_file, output, 'utf8');
    log.debug('Settings: %s', JSON.stringify(config[env]));
  } catch(e) {
    log.error(e);
    return {};
  }
}

module.exports.readConfig = readConfig;
module.exports.writeConfig = writeConfig;