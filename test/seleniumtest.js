//@ts-check
var assert = require('assert')
    , test = require('selenium-webdriver/testing')
    , webdriver = require('selenium-webdriver')
    , server = require('../server')
    ;

var port = process.env.PORT || 9999;

test.describe('Google search', () => {
    var driver /*= (new webdriver.Builder()).
        withCapabilities(webdriver.Capabilities.chrome()).
        build()*/;

    var s;

    test.before(function () {
        // If we are using Travis, let's connect to Sauce Labs remote web drivers
        console.log("Checking if in Travis.");
        if (process.env.TRAVIS || false) {
            console.log("In Travis.");
            var username = process.env.SAUCE_USERNAME
                , accessKey = process.env.SAUCE_ACCESS_KEY
                ;
            process.env.SELENIUM_REMOTE_URL = `https://${username}:${accessKey}@localhost:4445`;
            console.log(`Changed SELENIUM_REMOTE_URL to ${process.env.SELENIUM_REMOTE_URL}`);
        }

        console.log("Building driver.");
        driver = (new webdriver.Builder()).
            withCapabilities(webdriver.Capabilities.chrome()).
            build();

        if (!process.env.TRAVIS) {
            console.log("Creating server.");
            return new Promise((resolve, reject) => {
                s = server.createAndListen(port, resolve);
            });
        } else {
            console.log("Return null.");
            return Promise.resolve();
        }
    });

    test.after(() => {
        driver.quit();
        if (s) {
            s.close();
        }
    });

    test.it('Should work', function () {
        console.log("Driver get.");
        driver.get(`http://localhost:${port}/`);
        console.log("Get element.");
        return driver.findElement(webdriver.By.tagName('p'))
            .then(el => el.getText())
            .then(text => assert.equal(text, "Hi everybody!"))
            ;
    });
});