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
        if (process.env.TRAVIS || false) {
            var username = process.env.SAUCE_USERNAME
                , accessKey = process.env.SAUCE_ACCESS_KEY
                ;
            process.env.SELENIUM_REMOTE_URL = `https://${username}:${accessKey}@localhost:4445`;
        }

        driver = (new webdriver.Builder()).
            withCapabilities(webdriver.Capabilities.chrome()).
            build();

        if (!process.env.TRAVIS) {
            return new Promise((resolve, reject) => {
                s = server.createAndListen(port, resolve);
            });
        }
    });

    test.after(() => {
        driver.quit();
        if (s) {
            s.close();
        }
    });

    test.it('Should work', function () {
        driver.get(`http://localhost:${port}/`);
        return driver.findElement(webdriver.By.tagName('p'))
            .then(el => el.getText())
            .then(text => assert.equal(text, "Hi everybody!"))
            ;
    });
});