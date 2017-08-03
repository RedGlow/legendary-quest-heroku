import * as assert from "assert";
import * as http from "http";
import { switchcase } from "../func";
import getLinkedUrlObservables, { FetchFunction } from "./linkedurlobservable";

describe("linkedurlobservable", () => {
    const host = "127.0.0.1";
    const data0 = { block: "abc" };
    const data1 = { block: "def" };
    const data2 = { block: "ghi" };
    it("can load chained links", async () => {
        const fetchFunction: FetchFunction<{ block: string }> = (url) => Promise.resolve(switchcase({
            "http://localhost:9999": { content: data0, linkHeader: "</page1>; rel=next, </page2>; rel=last" },
            "http://localhost:9999/page1": { content: data1, linkHeader: "</page2>; rel=next, </page2>; rel=last" },
            "http://localhost:9999/page2": { content: data2, linkHeader: "</page2>; rel=last" },
        })((unknownUrl) => { throw new Error(`Unknown URL ${unknownUrl}`); })(url));
        const result = await getLinkedUrlObservables("http://localhost:9999", fetchFunction)
            .toArray()
            .toPromise();
        assert.deepEqual(result, [data0, data1, data2]);
    });
});
