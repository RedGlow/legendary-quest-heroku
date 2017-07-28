# legendary-quest-heroku

[![Build Status](https://travis-ci.org/RedGlow/legendary-quest-heroku.svg?branch=master)](https://travis-ci.org/RedGlow/legendary-quest-heroku)

Heroku App repository for the Legendary Quest project

# Local setup

In order to do local builds and testing, you need:
- Node.js (6.5)
- do an npm install
- a "phantomjs --webdriver=4444" (version 2.1.1) running in a console
- a mongodb (3.2) running on localhost; setup an user on it with a mongo console open like this:
    * use legendaryquesttest
    * db.createUser({user: "legendaryquesttest", pwd: "legendaryquesttest", roles: [{ role: "dbAdmin", db: "legendaryquesttest"}]})

# Local builds

The project uses gulp for compilation:
- "gulp build" will just build the project
- "gulp watch" will build it and stay on listen for changes

# Local testing

The testing is performed through npm (which calls mocha):
- "npm unittest" runs the unit tests
- "npm integrationtest" runs the integration tests