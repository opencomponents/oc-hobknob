oc-hobknob [![Build Status](https://secure.travis-ci.org/opencomponents/oc-hobknob.png?branch=master)](http://travis-ci.org/opencomponents/oc-hobknob)
==========

[OpenComponents](https://github.com/opentable/oc) plugin for interacting with [Hobknob](https://github.com/opentable/hobknob) toggles inside OC components.

# Requirements:

* Node version: min: **4**
* OC registry
* Hobknob server

### Install

```js
npm i oc-hobknob --save
```

### Registry setup

More info about integrating OC plugins: [here](https://github.com/opentable/oc/wiki/Registry#plugins)

```js
...
const registry = oc.registry(configuration);

registry.register({
  name: 'getToggle',
  register: require('oc-hobknob'),
  options: {
    host: 'hobknob-etcd.hosts.com',
    errorHandler: (err) => {
      console.log(err);
    }
  }
}, (err) => {
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

Example for a component's server.js:

```js

module.exports.data = (context, callback) => {
  callback(null, {
    showSomething: context.plugins.getToggle('myApp', 'toggleName', false)
  });
};
```

### API

#### Api for plugin setup:

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
