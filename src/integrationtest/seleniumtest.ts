import * as assert from "assert";
import { Server } from "http";
import { Db, MongoClient } from "mongodb";
import * as webdriver from "selenium-webdriver";
import * as test from "selenium-webdriver/testing";
import * as server from "../server";
import { dropDb } from "./helpers";

const port = parseInt(process.env.PORT || "9999", 10);

test.describe("Home page", () => {
    let driver: webdriver.ThenableWebDriver;
    let s: Server;

    process.env.SELENIUM_REMOTE_URL = `http://localhost:4444`;

    test.before(async () => {
        // Build the selenium webdriver
        driver = (new webdriver.Builder()).
            withCapabilities(webdriver.Capabilities.chrome()).
            build();

        // clean the db
        await dropDb();
        await new Promise((resolve, reject) => {
            // run the server
            s = server.createAndListen(port, resolve);
        });
    });

    test.after(async () => {
        s.close();
        await driver.quit();
    });

    test.it("Shows the home", () => {
        driver.get(`http://localhost:${port}/`);
        return driver.findElement(webdriver.By.tagName("p"))
            .then((el) => el.getText())
            .then((text) => assert.equal(text, "Hi everybody!"))
            ;
    });
});
