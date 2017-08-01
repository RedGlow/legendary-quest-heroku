import * as assert from "assert";
import { Server } from "http";
import * as fetch from "isomorphic-fetch";
import { Db, MongoClient } from "mongodb";
import * as Rx from "rxjs/Rx";
import * as db from "../db";
import { getJSON } from "../http";
import { IRecipe, isRecipeItem, RecipeType } from "../recipe";
import * as server from "../server";
import { dropDb } from "./helpers";

const port = parseInt(process.env.PORT, 10) || 9999;

describe("api", () => {
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

    it("Returns a single recipe on /recipes?resultitemids=44", async () => {
        const timestamp = new Date();
        await db.setTimestamp(timestamp);
        await db.saveRecipes([exampleRecipe], timestamp);
        const response = await fetch(getURL("/api/recipes?resultitemids=44"));
        assert.equal(response.status, 200);
        const json: IRecipe[] = await response.json();
        assert.equal(json.length, 1);
        const r = json[0].results[0];
        assert(isRecipeItem(r));
        if (isRecipeItem(r)) {
            assert.equal(r.id, 44);
        }
    });

    it("Returns two recipes on /recipes?resultitemids=44", async () => {
        const exampleRecipe2 = Object.assign({}, exampleRecipe, {
            ingredients: [{
                amount: 5,
                id: 36,
            }],
        });
        const timestamp = new Date();
        await db.setTimestamp(timestamp);
        await db.saveRecipes([exampleRecipe, exampleRecipe2], timestamp);
        const response = await fetch(getURL("/api/recipes?resultitemids=44"));
        assert.equal(response.status, 200);
        const json: IRecipe[] = await response.json();
        assert.equal(json.length, 2);
        for (let i = 0; i < 2; i++) {
            const r = json[i].results[0];
            assert(isRecipeItem(r));
            if (isRecipeItem(r)) {
                assert.equal(r.id, 44);
            }
        }
        assert.notDeepEqual(json[0].ingredients, json[1].ingredients);
    });

    it("Returns one recipe on /recipes?resultitemids=44 and exclude one that does not match", async () => {
        const exampleRecipe2 = Object.assign({}, exampleRecipe, {
            ingredients: [{
                amount: 5,
                id: 36,
            }],
            results: [{
                amount: 5,
                id: 45,
            }],
        });
        const timestamp = new Date();
        await db.setTimestamp(timestamp);
        await db.saveRecipes([exampleRecipe, exampleRecipe2], timestamp);
        const response = await fetch(getURL("/api/recipes?resultitemids=44"));
        assert.equal(response.status, 200);
        const json: IRecipe[] = await response.json();
        assert.equal(json.length, 1);
        const r = json[0].results[0];
        assert(isRecipeItem(r));
        if (isRecipeItem(r)) {
            assert.equal(r.id, 44);
        }
    });
});

const exampleRecipe: IRecipe = {
    _id: null,
    ingredients: [{
        amount: 4,
        id: 33,
    }],
    location: null,
    prerequisites: [],
    results: [{
        amount: 5,
        id: 44,
    }],
    source: "MySource",
    subtype: null,
    timestamp: null,
    type: "Vendor" as RecipeType,
};
