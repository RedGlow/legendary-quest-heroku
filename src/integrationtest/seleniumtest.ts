import * as assert from 'assert';
import * as test from 'selenium-webdriver/testing';
import * as webdriver from 'selenium-webdriver';
import * as server from '../server';
import { Server } from 'http';

var port = parseInt(process.env.PORT) || 9999;

test.describe('Home page', () => {
    var driver: webdriver.ThenableWebDriver;

    var s: Server;

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

    test.it('Shows the home', function () {
        console.log("Driver get.");
        driver.get(`http://localhost:${port}/`);
        console.log("Get element.");
        return driver.findElement(webdriver.By.tagName('p'))
            .then(el => el.getText())
            .then(text => assert.equal(text, "Hi everybody from RedGlow!"))
            ;
    });
});