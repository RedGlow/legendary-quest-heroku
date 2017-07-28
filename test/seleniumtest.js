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
        this.timeout(10000);
        driver = (new webdriver.Builder()).
            withCapabilities(webdriver.Capabilities.chrome()).
            build();
        return new Promise((resolve, reject) => {
            s = server.createAndListen(port, resolve);
        });
    });

    test.after(() => {
        driver.quit();
        s.close();
    });

    test.it('Should work', function () {
        driver.get(`http://localhost:${port}/`);
        return driver.findElement(webdriver.By.tagName('p'))
            .then(el => el.getText())
            .then(text => assert.equal(text, "Hi everybody!"))
            ;
    });
});