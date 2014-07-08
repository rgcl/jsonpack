TESTS = test/*.js

test:
	@./node_modules/.bin/mocha \
		$(TESTS) -R spec

.PHONY: test bench