/*global describe:true, before:true, after: true, it:true */

'use strict';

var util = require('util')
  , path = require('path')
  , fs = require('fs')
  , assert = require('chai').assert
  , should = require('chai').should()
  

var configFile=path.join(__dirname,'test.yaml');


describe(path.basename(__filename) + ' testing with: ' + configFile,function(){
  describe("updateConfig",function(){
    describe("updateDefault",function(){
      it('should save a new value for redis.host and redis.db in the \'default\' section of ' + path.basename(configFile), function (done) {
        var config = require('../lib/yaml-config')
          , settings = config.readConfig(configFile, 'default');

        settings.redis.host = '10.1.1.1';
        settings.redis.db = 2;
        config.updateConfig(settings,configFile,'default');
        done();
      });    
    });
    describe("checkDefault",function(){
      it('should see new values for redis.host and redis.db in the \'default\' section of '+ path.basename(configFile), function (done) {
        var config = require('../lib/yaml-config')
          , settings = config.readConfig(configFile, 'default');

        settings.redis.host.should.equal('10.1.1.1');
        settings.redis.db.should.equal(2);
        done();
      });     
    });
    describe("updateDevelopment",function(){
      it('should save a new value for redis.host and redis.db in the \'development\' section of ' + path.basename(configFile), function (done) {
        var config = require('../lib/yaml-config')
          , settings = config.readConfig(configFile);

        settings.redis.host = '10.1.100.100';
        settings.redis.db = 3;
        config.updateConfig(settings,configFile);
        done();
      });    
    });
    describe("checkDevelopment",function(){
      it('should see new values for redis.host and redis.db in the \'development\' section of '+ path.basename(configFile), function (done) {
        var config = require('../lib/yaml-config')
          , settings = config.readConfig(configFile);

        settings.redis.host.should.equal('10.1.100.100');
        settings.redis.db.should.equal(3);
        done();
      });     
    });  
    describe("updateProduction",function(){
      it('should save a new value for redis.host and redis.db in the \'production\' section of '+ path.basename(configFile), function (done) { 
        var config = require('../lib/yaml-config')
          , settings = config.readConfig(configFile, 'production');

        settings.redis.host = '10.1.50.100';
        settings.redis.db = 1;
        config.updateConfig(settings,configFile,'production');
        done();
      });    
    });
    describe("checkProduction",function(){
      it('should see new values for redis.host and redis.db in the \'production\' section of '+ path.basename(configFile), function (done) { 
        var config = require('../lib/yaml-config')
          , settings = config.readConfig(configFile, 'production');

        settings.redis.host.should.equal('10.1.50.100');
        settings.redis.db.should.equal(1);
        config.updateConfig(settings,configFile,'production');
        done();
      });     
    });

  });
  describe("revert",function(){
    describe("resetDefault",function(){
      it('Reset original values of the  \'default\' section of '+ path.basename(configFile), function (done) {
        var config = require('../lib/yaml-config')
          , settings = config.readConfig(configFile, 'default');

        settings.redis.host='127.0.0.1';
        settings.redis.db = 1;
        config.updateConfig(settings,configFile,'default');
        done();
      });    
    });
    describe("checkDefault",function(){
      it('default should now be back to the original values', function (done) {
        var config = require('../lib/yaml-config')
          , settings = config.readConfig(configFile, 'default');

        settings.redis.host.should.equal('127.0.0.1');
        settings.redis.db.should.equal(1);
        done();
      });    
    });
    describe("resetDevelopment",function(){
      it('Remove all values in the \'development\' section of '+ path.basename(configFile), function (done) {
        var config = require('../lib/yaml-config')
          , settings = {}; //setting settings to null will also work

        config.updateConfig(settings,configFile);
        done();
      });    
    });
    describe("checkDevelopment",function(){
      it('the \'development\' section no longer exists, should just see default values', function (done) {
        var config = require('../lib/yaml-config')
          , settings = config.readConfig(configFile);
        settings.redis.port.should.be.a('number');
        settings.redis.port.should.equal(6379);
        settings.redis.host.should.be.a('string');
        settings.redis.host.should.equal('127.0.0.1');
        settings.redis.password.should.be.a('string');
        settings.redis.password.should.equal('');    
        settings.redis.db.should.be.a('number');
        settings.redis.db.should.equal(1);
        settings.redis.options.should.be.a('object');
        done();
      });    
    });  
    describe("resetProduction",function(){
      it('Reset original values of the  \'production\' section of '+ path.basename(configFile), function (done) {
        var config = require('../lib/yaml-config')
          , settings = config.readConfig(configFile, 'production');

        settings.redis.host='127.0.0.1';
        settings.redis.db = 0;
        config.updateConfig(settings,configFile,'production');
        done();
      });    
    });
    describe("checkProduction",function(){
      it('production should now be back to the original values', function (done) {
        var config = require('../lib/yaml-config')
          , settings = config.readConfig(configFile, 'production');

        settings.redis.host.should.equal('127.0.0.1');
        settings.redis.db.should.equal(0);
        settings.new_prop.hello.should.equal('world');
        done();
      });    
    });  
  });
});
