An expiring LRU cache module for node.js. This builds
on the [lru-cache](https://github.com/isaacs/node-lru-cache) module.

# Usage

    var Cache = require('expiring-lru-cache');

    // Create a cache for up to 100 items (size). Items expire in 5 minutes
    // (300,000ms expiry).
    var accountCache = new Cache({size: 100, expiry: 300000});
    accountCache.set('hamish', {...});
    ...
    accountCache.get('hamish')    // => {...}


This also supports logging using [Bunyan](https://github.com/trentm/node-bunyan):

    var Cache = require('expiring-lru-cache');
    var Logger = require('bunyan');

    var log = new Logger({name: 'myapp', level: 'trace'});

    // 'name' is optional. It will be included in logging to help identify
    // the cache.
    var requestCache = new Cache({size: 50, expiry: 600000,
            log: log, name: 'request'});
    requestCache.set('a', 1)
    requestCache.get('a')       // => 1

This will then log at the TRACE level any cache usage:

    $ node example-with-logging.js
    {"name":"myapp","hostname":"banana.local","pid":44935,"level":10,"cache":{"name":"request","key":"a"},"msg":"cache set","time":"2012-03-07T22:28:40.317Z","v":0}
    {"name":"myapp","hostname":"banana.local","pid":44935,"level":10,"cache":{"name":"request","key":"a"},"msg":"cache hit","time":"2012-03-07T22:28:40.319Z","v":0}

    $ node example-with-logging.js | bunyan
    [2012-03-07T22:28:43.724Z] TRACE: myapp/44945 on banana.local: cache set
        cache: {
          "name": "request",
          "key": "a"
        }
    [2012-03-07T22:28:43.726Z] TRACE: myapp/44945 on banana.local: cache hit
        cache: {
          "name": "request",
          "key": "a"
        }


# Installation

    npm install expiring-lru-cache


# Changelog

[Changelog.](https://github.com/trentm/node-expiring-lru-cache/blob/master/CHANGES.md)


# License

MIT. See LICENSE.txt.


# API

    var cache = new Cache({
        size: <integer number of max items>,
        expiry: <number of milliseconds expiry of items>,
        log: <optional Bunyan log>,
        name: <optional name used for logging only>
    });
    cache.set(key, value)
    cache.get(key) -> value
    cache.del(key)
    cache.reset()
