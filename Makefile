
all:

#XXX
#test: node_modules/.bin/nodeunit
#	(cd test && make test)
#testall:
#	(cd test && make testall)

.PHONY: cutarelease
cutarelease: versioncheck
	./support/cutarelease.py -f package.json

