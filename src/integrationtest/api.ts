import * as assert from "assert";
import { Server } from "http";
import * as fetch from "isomorphic-fetch";
import { Db, MongoClient } from "mongodb";
import * as Rx from "rxjs/Rx";
import { getJSON } from "../http";
import * as server from "../server";
import { dropDb } from "./helpers";

const port = parseInt(process.env.PORT, 10) || 9999;

describe.only("api", () => {
    let s: Server;

    const getURL = (subpath: string) => `http://localhost:${port}${subpath}`;

    beforeEach(async () => {
        await dropDb();
        await new Promise((resolve, reject) => {
            // run the server
            s = server.createAndListen(port, resolve);
        });
    });

    afterEach(() => {
        s.close();
    });

    it("Returns an error on /recipes", async () => {
        const response = await fetch(getURL("/api/recipes"));
        assert.equal(response.status, 403);
        const json = await response.json();
        assert.equal(json.shortcode, "too-many");
    });
});
