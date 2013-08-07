/*global describe:true, before:true, after: true, it:true */

'use strict';

var util = require('util')
  , path = require('path')
  , fs = require('fs')
  , should = require('chai').should()
  , config = require('../lib/yaml-config')
  , configFile=path.join(__dirname, 'test.yaml');
  

describe(path.basename(__filename) + ' testing with: ' + configFile,function() {
  describe('readDefault',function() {
    it('should return only the \'default\' values in ' + path.basename(configFile), function (done) {
      var settings = config.readConfig(configFile,'default');
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

  describe('readTest',function() {
    it('should return the union of the \'default\' and \'test\' objects in ' + path.basename(configFile), function (done) {
      var settings = config.readConfig(configFile,'test');

      settings.redis.port.should.equal(6379);
      settings.redis.host.should.equal('127.0.0.1');
      settings.redis.password.should.equal('');    
      settings.redis.db.should.equal(12);
      settings.redis.options.should.be.a('object');
      done();
    });
  });

  describe('readTest',function() {
    it('should return the union of the \'default\' and \'production\' objects in ' + path.basename(configFile), function (done) {
      var settings = config.readConfig(configFile,'production');
      settings.redis.port.should.equal(6379);
      settings.redis.host.should.equal('127.0.0.1');
      settings.redis.password.should.equal('');
      settings.redis.db.should.equal(0);
      settings.new_prop.hello.should.equal('world');
      settings.redis.options.should.be.a('object');
      done();
    });    
  });   
});
