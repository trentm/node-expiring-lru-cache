# node-expiring-lru-cache Changelog

## 2.1.0

- Update dependency lru-cache to v1.1 to keep up (no other particular reason).
- [issue #1] Delete expired keys on `<cache>.get(<key>)`. One reason is to
  reduce the likelihood of expired keys clogging up the cache.
  (by github.com/jacobbubu)


## 2.0.1

- Fix for `<cache>.dump()` to actually show the underlying LRU cached items.
  Note: You need the dependent lru-cache v1.0.6 or greater to get
  its `<cache>.dump()` (see <https://github.com/isaacs/node-lru-cache/pull/3>).


## 2.0.0

- [Backward incompat change] Change the input expiry to be in milliseconds.
  Most (all?) core node.js timeouts and times are in milliseconds. As well,
  sub-second expiry might be useful (it is for the test suite).


## 1.0.0

First release.
