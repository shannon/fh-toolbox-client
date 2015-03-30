FeedHenry Toolbox App
==========================

A basic app that excersises all the main components of the FeedHenry SDKS.

# Components

## Client

These are client side components that excersise the fh-js-sdk.

### $fh.cloud

1. Enter a name and click submit. 

You should see a message 'Hello from the cloud Name!' below.

### $fh.hash

1. Select an algorithm, enter some text, and click submit.

You should see the Hash Value below.

### $fh.sec

1. Select an algorithm, select a key length, and click generate. You should see an encryption key below.
2. Enter some text and click encrypt. 

You should see a list of encrypted messages below.
* You can add more messages and click the lock icons to encrypt/decrypt those messages.

### $fh.getCloudUrl

You should the Cloud URL

### $fh.getFHParams

You should the FH Params JSON object

### $fh.auth

1. This requires a FeedHenry auth policy to be set up for the domain
2. Enter Policy ID, the username and password, and click submit. 

You should see "Login Succeeded" below.

## Cloud

These are server side components that excersise the fh-mbaas-api.

### $fh.service

1. Enter a service GUID, select method type, enter a path, enter JSON params, and click submit. 

You should see MBaaS Response below.

### $fh.hash

Same process as Client $fh.hash above

### $fh.sec

Same process as Client $fh.sec above

### $fh.db

1. Click + floating action button
2. Fill out form and click save

You should see a list of entries. 
* You can add edit and delete entries.
* You can also click clear entries to excercise the deleteAll method.

### $fh.cache

1. Enter a value and click submit.

You should see the cached value below.
* The value will remain in cache for 60 seconds.

### $fh.stats

All cloud calls are run through the stats api so any cloud component should be tracked in stats.

# Development

## Grunt

This template uses [Grunt](http://gruntjs.com/), the Javascript Task Runner. To use Grunt with this Template App, do the following:

* Install grunt: ```npm install -g grunt-cli```
* In your App directory, run: ```npm install```. This installs Grunt plugins, etc for use with this App.
* Run ```grunt serve``` to preview this App locally


### FeedHenry local development

You can also use Grunt to point your App at a local developement server. To do this, use the ```grunt serve:local``` command. Some notes on using the serve:local task:

* by default, the local server development url is: http://localhost:8001
* you can change this directly in your local Gruntfile.js, in the app config:

```
  app: {
    // configurable paths
    app: 'www',
    url: '',
    default_local_server_url: 'http://localhost:8001'
  },
```

* you can also pass a 'url' optional flag to server:local, e.g. ```grunt serve:local --url=http://localhost:9000```

* We can also write your own tasks by extending the Gruntfile.js, e.g. add a 'serve:live' target that hits your server in your FeedHenry live enivronment.
