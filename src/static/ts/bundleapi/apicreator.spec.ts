import "mocha";
import * as assert from "../assert";
import { ITestConfiguration, setTestConfiguration } from "../testconf";
import create from "./apicreator";
import { Bucket } from "./bucket";

describe("bundleapi/apicreator", () => {
    let c: ITestConfiguration;
    let b: Bucket;
    let e: (path: string, id: number) => Promise<any>;
    const h33 = { id: 33 };
    const h34 = { id: 34 };
    const h35 = { id: 35 };

    beforeEach(() => {
        c = setTestConfiguration();
        b = new Bucket(1, 10, 100);
        e = create(b, "https://api.guildwars2.com", "ids", "id", {
            nobundlepaths: ["/v2/recipessearch"],
        });
    });

    it("Can run a simple request", async () => {
        c.setFetchResponse("https://api.guildwars2.com/v2/items?ids=33", JSON.stringify([h33]), {});
        const result = await e("/v2/items", 33);
        assert.deepEqual(result, h33);
    });

    it("Can run two simple requests", async () => {
        c.setFetchResponse("https://api.guildwars2.com/v2/items?ids=33,34", JSON.stringify([h33, h34]), {});
        const results = await Promise.all([
            e("/v2/items", 33),
            e("/v2/items", 34),
        ]);
        assert.deepEqual(results[0], h33);
        assert.deepEqual(results[1], h34);
    });

    it("Runs a single request, but then must wait for a slot for a second one", async () => {
        c.setFetchResponse("https://api.guildwars2.com/v2/items?ids=33", JSON.stringify([h33]), {});
        c.setFetchResponse("https://api.guildwars2.com/v2/stuff?ids=34", JSON.stringify([h34]), {});
        const promise1 = e("/v2/items", 33);
        let result2 = null;
        const promise2 = e("/v2/stuff", 34).then((r) => { result2 = r; });
        const result = await promise1;
        assert.deepEqual(result, h33);
        assert.deepEqual(result2, null);
        await c.setTime(100);
        assert.deepEqual(result2, h34);
    });

    it("Can enqueue multiple requests for the same item", async () => {
        c.setFetchResponse("https://api.guildwars2.com/v2/items?ids=33", JSON.stringify([h33]), {});
        const promise1 = e("/v2/items", 33);
        const promise2 = e("/v2/items", 33);
        const results = await Promise.all([promise1, promise2]);
        assert.deepEqual(results[0], h33);
        assert.deepEqual(results[1], h33);
    });

    it("Can resolve a later request if a previous one on the same endpoint was always enqueued", async () => {
        c.setFetchResponse("https://api.guildwars2.com/v2/items?ids=33,34", JSON.stringify([h33, h34]), {});
        c.setFetchResponse("https://api.guildwars2.com/v2/stuff?ids=35", JSON.stringify([h35]), {});
        let result1 = null;
        const promise1 = e("/v2/items", 33).then((r) => { result1 = r; });
        let result2 = null;
        const promise2 = e("/v2/stuff", 35).then((r) => { result2 = r; });
        let result3 = null;
        const promise3 = e("/v2/items", 34).then((r) => { result3 = r; });
        await Promise.all([promise1, promise3]);
        assert.deepEqual(result1, h33);
        assert.deepEqual(result2, null);
        assert.deepEqual(result3, h34);
        await c.setTime(100);
        assert.deepEqual(result2, h35);
    });

    it("Resolve to null if an entry is not found", async () => {
        c.setFetchResponse("https://api.guildwars2.com/v2/items?ids=33,34", JSON.stringify([h34]), {});
        const results = await Promise.all([e("/v2/items", 33), e("/v2/items", 34)]);
        assert.deepEqual(results[0], null);
        assert.deepEqual(results[1], h34);
    });

    it("Accepts a 404 when no entries are found", async () => {
        c.setFetchResponse("https://api.guildwars2.com/v2/items?ids=33",
            JSON.stringify({ text: "all ids provided are invalid" }),
            {
                status: 404,
                statusText: "Not found",
            });
        const result = await e("/v2/items", 33);
        assert.equal(result, null);
    });

    it("Returns error in case an error status is returned", async () => {
        c.setFetchResponse("https://api.guildwars2.com/v2/items?ids=33",
            "Internal server error",
            {
                status: 500,
                statusText: "Internal server error",
            });
        let errorred = false;
        await e("/v2/items", 33)
            .then((res) => {
                return Promise.reject("Should not return a value");
            })
            .catch((err) => {
                errorred = true;
            });
        assert.equal(errorred, true);
    });

    it("Runs separate requests for nobundle paths", async () => {
        c.setFetchResponse("https://api.guildwars2.com/v2/recipessearch?ids=33", JSON.stringify([h33]), {});
        c.setFetchResponse("https://api.guildwars2.com/v2/recipessearch?ids=34", JSON.stringify([h34]), {});
        let result2arrived = false;
        const promise1 = e("/v2/recipessearch", 33);
        const promise2 = e("/v2/recipessearch", 34).then((res) => { result2arrived = true; return res; });
        const result1 = await promise1;
        assert.deepEqual(result1, [h33]);
        assert.equal(result2arrived, false);
        await c.setTime(100);
        const result2 = await promise2;
        assert.deepEqual(result2, [h34]);
    });
});
