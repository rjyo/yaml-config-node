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

/**
* Removes properties of the 'dest' object where the 'from' objects
* properties exactly match those in the 'dest' object
*
* @private
* @param {Object} dest An obect with a set of properties
* @param {Object} from An object with an overlapping set of properties you wish to remove from 'dest'
 */

var complement = function(dest, from){
  var props = Object.getOwnPropertyNames(from);
  props.forEach(function(name) {
    if (name in from && typeof from[name] === 'object') {
      if(typeof dest[name] !== 'undefined'){
        complement(dest[name], from[name]);
        //If all keys were removed, remove the object
        if(Object.keys(dest[name]).length === 0){
          delete dest[name];
        }
      }
    } else {
      if(dest[name] === from[name]){
        delete dest[name];
      }
    }
  });
};

var readConfig = function(config_file, env) {
  if (!env) {
    env = process.env.NODE_ENV || 'development';
  }
  log.debug('Using %s environment.', env);

  try {
    //The require method  of loading the configuration doesnt semm dependable
    //When called several times in a row, it causes the tests to fail
    //var config = require(config_file);
    var configData = fs.readFileSync(config_file, 'utf8');
    var config = yaml.safeLoad(configData);
    var settings = config['default'] || {};
    var settings_env = config[env] || {};

    extend(settings, settings_env);

    log.debug('Read settings for \'%s\': %s', env, JSON.stringify(settings));
    return settings;
  } catch(e) {
    log.error(e);
    return {};
  }
};
/**
* Updates the 'config_file object such that it only contain properties that are different from the defaults
* and writes the modified configuration for that environment back to the specified yaml configuration file
*
* NOTE: Currently this function does not support preserving comments
*
* @private
* @param {Object} current_config A settings object representing an updated state for a configuration file
* @param {String} config_file A path to an existing configuration file
* @param {String} env The section to be updated
 */

var updateConfig = function(current_config, config_file, env) {
  if(!config_file){
    //May want to add functionality to write out to a different file later.
    log.debug('No configuration file specified, no update peformed');
    return;
  }
  if (!env) {
    env = process.env.NODE_ENV || 'development';
  }
  log.debug('Updating %s environment.', env);

  try {
    //Load settings from the configuration file
    var configData = fs.readFileSync(config_file, 'utf8');
    var config = yaml.safeLoad(configData);
    var settings = config['default'] || {};
    if(current_config===null || Object.keys(current_config).length===0){
      if(typeof config[env] !== 'undefined'){
        delete config[env];
      }
      log.debug('Deleted settings for \'%s\': %s', env, JSON.stringify(config));
    }
    else{
      if(env!=='default'){
        //Remove all properties from the current configuration that exist
        //in the default AND are equal to the default value
        complement(current_config, settings);
      }
      //Update the values in the configuration
      config[env] = current_config;
      log.debug('Updated settings for \'%s\': %s', env, JSON.stringify(config));
    }
    var output = yaml.safeDump(config,config.CORE_SCHEMA);
    fs.writeFileSync(config_file, output, 'utf8');
  } catch(e) {
    log.error(e);
  }
};

module.exports.readConfig = readConfig;
module.exports.updateConfig = updateConfig;
