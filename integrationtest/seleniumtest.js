//@ts-check
var assert = require('assert')
    , test = require('selenium-webdriver/testing')
    , webdriver = require('selenium-webdriver')
    , server = require('../src/server')
    ;

var port = process.env.PORT || 9999;

test.describe('Home page', () => {
    var driver /*= (new webdriver.Builder()).
        withCapabilities(webdriver.Capabilities.chrome()).
        build()*/;

    var s;

    test.before(function () {
        // If we are using Travis, let's connect to Sauce Labs remote web drivers
        process.env.SELENIUM_REMOTE_URL = `http://localhost:4444`;
        console.log(`Changed SELENIUM_REMOTE_URL to ${process.env.SELENIUM_REMOTE_URL}`);

        console.log("Building driver.");
        driver = (new webdriver.Builder()).
            withCapabilities(webdriver.Capabilities.chrome()).
            build();

        console.log("Creating server.");
        return new Promise((resolve, reject) => {
            s = server.createAndListen(port, resolve);
        });
    });

    test.after(() => {
        driver.quit();
        s.close();
    });

    test.it('Should work', function () {
        console.log("Driver get.");
        driver.get(`http://localhost:${port}/`);
        console.log("Get element.");
        return driver.findElement(webdriver.By.tagName('p'))
            .then(el => el.getText())
            .then(text => assert.equal(text, "Hi everybody from RedGlow!"))
            ;
    });
});