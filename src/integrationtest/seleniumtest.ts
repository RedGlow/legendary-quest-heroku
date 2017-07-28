import * as assert from 'assert';
import * as test from 'selenium-webdriver/testing';
import * as webdriver from 'selenium-webdriver';
import * as server from '../server';
import { Server } from 'http';
import { MongoClient, Db } from 'mongodb';

var port = parseInt(process.env.PORT) || 9999;

test.describe('Home page', () => {
    var driver: webdriver.ThenableWebDriver;

    var s: Server;

    test.before(function () {
        // If we are using Travis, let's connect to Sauce Labs remote web drivers
        process.env.SELENIUM_REMOTE_URL = `http://localhost:4444`;

        // Build the selenium webdriver
        driver = (new webdriver.Builder()).
            withCapabilities(webdriver.Capabilities.chrome()).
            build();

        // clean the db
        process.env.MONGODB_URI = process.env.MONGODB_URI ||
            'mongodb://legendaryquesttest:legendaryquesttest@localhost:27017/legendaryquesttest';
        return new Promise<Db>((resolve, reject) => {
            MongoClient.connect(process.env.MONGODB_URI, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        })
            .then(db => db.dropDatabase())
            .then(() => new Promise((resolve, reject) => {
                // run the server
                s = server.createAndListen(port, resolve);
            }));
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