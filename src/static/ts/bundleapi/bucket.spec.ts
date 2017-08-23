import * as _ from "lodash";
import "mocha";
import * as assert from "../assert";
import { ITestConfiguration, setTestConfiguration } from "../testconf";
import { Bucket } from "./bucket";

describe("bundleapi/bucket", () => {
    let c: ITestConfiguration;
    let b: Bucket;
    beforeEach(() => {
        c = setTestConfiguration();
        b = new Bucket(1, 10, 100);
    });
    it("first request must not wait", async () => {
        await b.getToken();
    });
    it("two consecutive requests: the second must wait the millisecondsBetweenRequests", async () => {
        await b.getToken();
        let resolved = false;
        const secondPromise = b.getToken().then(() => { resolved = true; });
        await c.setTime(50);
        assert.equal(resolved, false);
        await c.setTime(100);
        await secondPromise;
        assert.equal(resolved, true);
    });
    it("cannot have more than the capacity of requests", async () => {
        await c.setTime(1000);
        for (let i = 0; i < 10; i++) {
            await b.getToken();
        }
        let resolved = false;
        const secondPromise = b.getToken().then(() => { resolved = true; });
        assert.equal(resolved, false);
        await c.setTime(1001);
        assert.equal(resolved, false);
        await c.setTime(1100);
        await secondPromise;
        assert.equal(resolved, true);
    });
});
