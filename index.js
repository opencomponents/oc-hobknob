'use strict';

var request = require('minimal-request');
var _ = require('lodash');

var client,
    values;

module.exports.register = function(options, dependencies, next){

  var getUpdatedValues = function(){
    var port = options.port || 4001;

    request({
      url: 'http://' + options.host + ':' + port + '/v2/keys/v1/toggles/?recursive=true',
      json: true
    }, function(err, res, body){
      if(!!err || !_.isObject(body)){
        options.errorHandler(err);
      } else {
        values = body;
      }

      setTimeout(getUpdatedValues, options.syncInterval || 30000);
      next();
    });
  };

  getUpdatedValues();
};

module.exports.execute = function(appName, toggleName, secondaryKey, defaultValue){

  if(_.toArray(arguments) < 3){
    return false;
  }

  if(_.isUndefined(defaultValue)){
    defaultValue = secondaryKey;
    secondaryKey = null;
  }

  var nodeKey = '/v1/toggles/' + appName,
      p;

  if(!values || !values.node || !values.node.nodes){ return defaultValue; }

  p = values.node.nodes;
  p = _.find(p, { key: nodeKey });

  if(!p || !p.nodes){ return defaultValue; }

  p = p.nodes;
  nodeKey += '/' + toggleName;
  p = _.find(p, { key: nodeKey });

  if(!p || (!!p.dir && !secondaryKey) || (!p.dir && !p.value)){
    return defaultValue;
  } else if(!!p.value){
    return p.value === 'true';
  }

  p = p.nodes;
  nodeKey += '/' + secondaryKey;
  p = _.find(p, { key: nodeKey });

  if(!p || !p.value){ return defaultValue; }

  return p.value === 'true';
};