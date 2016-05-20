'use strict';

var expect = require('chai').expect;
var injectr = require('injectr');
var sinon = require('sinon');
var _ = require('lodash');

var getTogglePlugin,
    errorHandler;

var initialise = function(err, res, done){

  getTogglePlugin = injectr('../index.js', {
    'minimal-request': sinon.stub().yields(err, res)
  }, { setTimeout: _.noop, console: console });

  errorHandler = sinon.spy();

  getTogglePlugin.register({
    host: 'http://etc-host.hosts.com',
    port: 4001,
    errorHandler: errorHandler
  }, {}, done);
};

var getToggle = function(app, key, key2, dValue){
  return getTogglePlugin.execute(app, key, key2, dValue);
};

describe('oc-hobknob', function(){

  describe('when receiving error from etcd', function(){

    before(function(done){
      initialise({anError: true}, null, done);
    });

    it('should pass the error through the errorHandler', function(){
      expect(errorHandler.args[0]).to.eql([{anError: true}]);
    });
  });

  describe('when receiving bad response from etcd', function(){

    before(function(done){
      initialise(null, 'this is not a stringified json', done);
    });

    it('should pass the error through the errorHandler', function(){
      expect(errorHandler.args[0]).not.to.be.empty;
    });
  });

  describe('when receiving valid response from etcd', function(){

    before(function(done){
      initialise(null, {
        action: 'get',
        node: {
          key: '/v1/toggles',
          dir: true,
          nodes: [{
            key: '/v1/toggles/some-service',
            dir: true,
            nodes: [{
              key: '/v1/toggles/some-service/a-toggle',
              value: 'true'
            }]
          }, {
            key: '/v1/toggles/another-service',
            dir: true,
            nodes: [{
              key: '/v1/toggles/another-service/domain-toggle',
              dir: true,
              nodes: [{
                key: '/v1/toggles/another-service/domain-toggle/@meta',
                value: '{\"categoryId\":1}'
              }, {
                key: '/v1/toggles/another-service/domain-toggle/com',
                value: 'false'
              }, {
                key: '/v1/toggles/another-service/domain-toggle/couk'
              }]
            }]
          }]
        }
      }, done);
    });

    it('should get default value when specifying not existing app', function(){
      expect(getToggle('nope', 'a-toggle', false)).to.equal(false);
    });

    it('should get default value when specifying not existing key value', function(){
      expect(getToggle('some-service', 'nope', true)).to.equal(true);
    });

    it('should get default value when not specifying mandatory secondary key value', function(){
      expect(getToggle('another-service', 'domain-toggle', true)).to.equal(true);
    });

    it('should get toggle value when specifying existing app + key values', function(){
      expect(getToggle('some-service', 'a-toggle', false)).to.equal(true);
    });

    it('should get toggle value when specifying existing app + key + secondary key values', function(){
      expect(getToggle('another-service', 'domain-toggle', 'com', true)).to.equal(false);
    });
  });
});
