oc-hobknob [![Build Status](https://secure.travis-ci.org/opentable/oc-hobknob.png?branch=master)](http://travis-ci.org/opentable/oc-hobknob)
==========

[OpenComponents](https://github.com/opentable/oc) plugin for interacting with [Hobknob](https://github.com/opentable/hobknob) toggles inside OC components.

# Requirements:

* Node version: min: **0.10.40**, recommended: **>=4.2.X**
* OC registry
* Hobknob server

### Install

```js
npm i oc-hobknob --save
```

### Registry setup

More info about integrating OC plugins: [here](https://github.com/opentable/oc/blob/master/docs/registry.md#plugins)

```js
...
var registry = new oc.registry(configuration);

registry.register({
  name: 'getToggle',
  register: require('oc-hobknob'),
  options: {
    host: 'hobknob-etcd.hosts.com',
    errorHandler: function(err){
      console.log(err);
    }
  }
}, function(err){
  if(err){
    console.log('plugin initialisation failed:', err);
  } else {
    console.log('hobknob now available');
  }
});

...

registry.start(callback);
```

### Using it inside components

Example for a components' server.js:

```js

module.exports.data = function(context, callback){
  callback(null, {
    showSomething: context.plugins.getToggle('myApp', 'toggleName', false)
  });
};
```

### API

####Api for plugin setup:

|parameter|type|mandatory|description|
|---------|----|---------|-----------|
|errorHandler|`function`|no|The error handler|
|host|`string`|yes|The hobknob etcd host|
|port|`number`|no|Default 4001, the etcd port|
|syncInterval|`number` (ms)|no|Default 30000, time for the internal cache to refresh|

#### Api for plugin usage:

The plugin name is declared when initialising a plugin. Following assumes `getToggle` is the designated name.

##### context.plugins.getToggle(serviceName, toggleName)

Syncronous function that gets a value for a given Service name and toggle. Default for when hobknob doesn't have the value is `false`.

##### context.plugins.getToggle(serviceName, toggleName, defaultValue)

Syncronous function that gets a value for a given Service name and toggle. Default for when hobknob doesn't have the value is `false`.

##### context.plugins.getToggle(serviceName, toggleName, secondaryToggleKey, defaultValue)

Syncronous function that gets an Hobknob toggle value for a given serviceName and toggleName and secondaryToggleKey using specified default value. 

# Contributing

Yes please. Open an issue first.

### License

MIT
