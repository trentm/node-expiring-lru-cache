/*
 * Copyright 2011 Joyent, Inc.  All rights reserved.
 *
 * Test expiring-lru-cache.
 */

var fs = require('fs');
var test = require('tap').test;
var Logger = require('bunyan');
var Cache = require('../lib/expiring-lru-cache');


test('cache', function(t) {
  var cache = new Cache({size: 3, expiry: 60});
  cache.set('a', 1)
  cache.set('b', 2)
  cache.set('c', 3)
  t.equal(cache.get('a'), 1)
  t.equal(cache.get('b'), 2)
  t.equal(cache.get('c'), 3)

  cache.set('d', 4)  // should eject 'a'
  t.equal(cache.get('a'), null, 'a now null')
  t.equal(cache.get('d'), 4)

  cache.del('b')
  t.equal(cache.get('b'), null, 'b now null')

  cache.reset()
  t.equal(cache.get('c'), null, 'c now null')
  t.equal(cache.get('d'), null, 'd now null')
  t.end();
});


test('cache with logging', function(t) {
  var records = [];
  function LogStream() {}
  LogStream.prototype.write = function (s) {
    records.push(JSON.parse(s))
  }
  var log = new Logger({
    name: 'boolly',
    stream: new LogStream(),
    level: 'trace'
  });
  var cache = new Cache({size: 3, expiry: 60, log: log, name: 'mycache'});

  // Test caching a circular object that can't be JSON.stringify'd. This
  // ensures that Bunyan logging usage in the library isn't brittle with
  // complex cached objects.
  var d = {};
  d.d = d;

  var r, i = 0;
  cache.set('a', d)
  r = records[i++]
  t.ok(r)
  t.equal(r.name, 'boolly')
  t.equal(r.level, Logger.TRACE)
  t.equal(r.cache.name, 'mycache')
  t.equal(r.cache.key, 'a')
  t.equal(r.msg, 'cache set')

  cache.get('a')
  r = records[i++];
  t.equal(r.msg, 'cache hit')
  t.equal(r.cache.name, 'mycache')
  t.equal(r.cache.key, 'a')

  cache.get('b')
  r = records[i++];
  t.equal(r.msg, 'cache miss')
  t.equal(r.cache.name, 'mycache')
  t.equal(r.cache.key, 'b')

  cache.del('a')
  r = records[i++];
  t.equal(r.msg, 'cache del')
  t.equal(r.cache.name, 'mycache')
  t.equal(r.cache.key, 'a')

  cache.reset()
  r = records[i++];
  t.equal(r.msg, 'cache reset')
  t.equal(r.cache.name, 'mycache')
  t.notOk(r.cache.key)

  t.end();
});


test('cache expiry', function(t) {
  var cache = new Cache({size: 3, expiry: 1});
  cache.set('a', 1);
  t.equal(cache.get('a'), 1)
  setTimeout(function () {
    t.equal(cache.get('a'), null, 'a now null')
    t.end();
  }, 2000);
});

