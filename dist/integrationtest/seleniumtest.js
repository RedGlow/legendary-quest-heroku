Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var test = require("selenium-webdriver/testing");
var webdriver = require("selenium-webdriver");
var server = require("../server");
var port = parseInt(process.env.PORT) || 9999;
test.describe('Home page', function () {
    var driver;
    var s;
    test.before(function () {
        // If we are using Travis, let's connect to Sauce Labs remote web drivers
        process.env.SELENIUM_REMOTE_URL = "http://localhost:4444";
        console.log("Changed SELENIUM_REMOTE_URL to " + process.env.SELENIUM_REMOTE_URL);
        console.log("Building driver.");
        driver = (new webdriver.Builder()).
            withCapabilities(webdriver.Capabilities.chrome()).
            build();
        console.log("Creating server.");
        return new Promise(function (resolve, reject) {
            s = server.createAndListen(port, resolve);
        });
    });
    test.after(function () {
        driver.quit();
        s.close();
    });
    test.it('Shows the home', function () {
        console.log("Driver get.");
        driver.get("http://localhost:" + port + "/");
        console.log("Get element.");
        return driver.findElement(webdriver.By.tagName('p'))
            .then(function (el) { return el.getText(); })
            .then(function (text) { return assert.equal(text, "Hi everybody from RedGlow!"); });
    });
});
