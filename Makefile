
#
# Tools
#
TOP := $(shell pwd)
TAP = ./node_modules/tap/bin/tap.js
NODE4 = $(HOME)/opt/node-0.4/bin/node
NODE6 = $(HOME)/opt/node-0.6/bin/node
NODEMASTER = $(HOME)/opt/node-master/bin/node

#
# Targets
#

all:

.PHONY: test
test: | node_modules/tap
	TAP=1 node $(TAP) test/*.test.js

.PHONY: testall
testall:
	@echo "# Test with node 0.4 ($(shell $(NODE4) --version))."
	TAP=1 $(NODE4) $(TAP) test/*.test.js
	@echo "\n\n# Test with node 0.6 ($(shell $(NODE6) --version))."
	TAP=1 $(NODE6) $(TAP) test/*.test.js
	@echo "\n\n# Test with node master ($(shell $(NODEMASTER) --version))."
	TAP=1 $(NODEMASTER) $(TAP) test/*.test.js

.PHONY: cutarelease
cutarelease:
	./tools/cutarelease.py -f package.json
