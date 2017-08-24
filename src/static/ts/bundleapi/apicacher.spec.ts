import * as _ from "lodash";
import "mocha";
import * as assert from "../assert";
import { ITestConfiguration, setTestConfiguration } from "../testconf";
import createCacher from "./apicacher";

describe.only("bundleapi/apicacher", () => {
    let c: ITestConfiguration;
    let e: (path: string, id: number) => Promise<any>;
    let e2: (path: string, id: number) => Promise<any>;

    const h1 = { id: 1 };
    const h2 = { id: 2 };
    const s1 = { id: 10 };
    const calls = [] as [any[]];
    const results = {} as { [path: string]: { [id: number]: any } };
    const call = (path: string, id: number): Promise<any> => {
        calls.push([path, id]);
        return _.has(results, `[${path}][${id}]`) ?
            Promise.resolve(results[path][id]) :
            Promise.reject(`Unknown path=${path} and id=${id}`);
    };

    beforeEach(() => {
        c = setTestConfiguration();
        e = createCacher(call, 1000, {
            endpointTimeouts: { "/v2/stuff": 2000 },
        });
        e2 = createCacher(call, 1000, {
            endpointTimeouts: { "/v2/stuff": 2000 },
        });
        calls.length = 0;
        results["/v2/items"] = {
            1: h1,
        };
        results["/v2/stuff"] = {
            1: s1,
        };
    });

    it("Runs a single request", async () => {
        const result1 = await e("/v2/items", 1);
        assert.deepEqual(result1, h1);
        assert.deepEqual(calls, [["/v2/items", 1]]);
    });

    it("Doesn't run a second request if the first one is still in cache", async () => {
        const result1 = await e("/v2/items", 1);
        const result2 = await e("/v2/items", 1);
        assert.deepEqual(result1, h1);
        assert.deepEqual(result2, h1);
        assert.deepEqual(calls, [["/v2/items", 1]]);
    });

    it("Repeats calls once the old result has changed", async () => {
        const result1 = await e("/v2/items", 1);
        await c.setTime(1000);
        const result2 = await e("/v2/items", 1);
        assert.deepEqual(result1, h1);
        assert.deepEqual(result2, h1);
        assert.deepEqual(calls, [["/v2/items", 1], ["/v2/items", 1]]);
    });

    it("Doesn't use stale values", async () => {
        const result1 = await e("/v2/items", 1);
        await c.setTime(1000);
        results["/v2/items"][1] = h2;
        const result2 = await e("/v2/items", 1);
        assert.deepEqual(result1, h1);
        assert.deepEqual(result2, h2);
        assert.deepEqual(calls, [["/v2/items", 1], ["/v2/items", 1]]);
    });

    it("Respects special timeouts", async () => {
        await e("/v2/stuff", 1);
        assert.deepEqual(calls, [["/v2/stuff", 1]]);
        await c.setTime(1000);
        await e("/v2/stuff", 1);
        assert.deepEqual(calls, [["/v2/stuff", 1]]);
        await c.setTime(2000);
        await e("/v2/stuff", 1);
        assert.deepEqual(calls, [["/v2/stuff", 1], ["/v2/stuff", 1]]);
    });

    it("Doesn't overwrite another cacher", async () => {
        await c.setTime(1000);
        await e("/v2/stuff", 1);
        await e2("/v2/stuff", 1);
        assert.deepEqual(calls, [["/v2/stuff", 1], ["/v2/stuff", 1]]);
    });
});
