## Execute automated tests

.PHONY: test
test:
	/bin/bash test/startServer.sh
	@PORT=8081 ./node_modules/.bin/mocha -u bdd -R spec --recursive --timeout 60000
	/bin/bash test/stopServer.sh
