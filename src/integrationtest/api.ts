import * as assert from "assert";
import { Server } from "http";
import * as fetch from "isomorphic-fetch";
import { Db, MongoClient } from "mongodb";
import * as Rx from "rxjs/Rx";
import * as db from "../db";
import { getJSON } from "../http";
import { IRecipe, isRecipeItem, RecipeType } from "../recipe";
import { IRecipeUnlock } from "../recipeunlock";
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

    it("Returns an error on /recipeunlocks", async () => {
        const response = await fetch(getURL("/api/recipeunlocks"));
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

    it("Returns a single recipe on /recipeunlocks?recipeids=44", async () => {
        const timestamp = new Date();
        await db.setTimestamp(timestamp);
        await db.saveRecipeUnlocks([exampleRecipeUnlock], timestamp);
        const response = await fetch(getURL("/api/recipeunlocks?recipeids=44"));
        assert.equal(response.status, 200);
        const json: IRecipeUnlock[] = await response.json();
        assert.equal(json.length, 1);
        assert.equal(json[0].recipe_id, 44);
        assert.equal(json[0].recipe_sheet_id, 100);
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

    it("Returns two recipes on /recipeunlocks?recipeids=44", async () => {
        const exampleRecipeUnlock2 = Object.assign({}, exampleRecipeUnlock, {
            recipe_sheet_id: 101,
        });
        const timestamp = new Date();
        await db.setTimestamp(timestamp);
        await db.saveRecipeUnlocks([exampleRecipeUnlock, exampleRecipeUnlock2], timestamp);
        const response = await fetch(getURL("/api/recipeunlocks?recipeids=44"));
        assert.equal(response.status, 200);
        const json: IRecipeUnlock[] = await response.json();
        assert.equal(json.length, 2);
        for (let i = 0; i < 2; i++) {
            assert.equal(json[i].recipe_id, 44);
        }
        assert.notEqual(json[0].recipe_sheet_id, json[1].recipe_sheet_id);
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

    it("Returns one recipe on /recipeunlocks?recipeids=44 and exclude one that does not match", async () => {
        const exampleRecipeUnlock2 = Object.assign({}, exampleRecipeUnlock, {
            recipe_id: 45,
            recipe_sheet_id: 101,
        });
        const timestamp = new Date();
        await db.setTimestamp(timestamp);
        await db.saveRecipeUnlocks([exampleRecipeUnlock, exampleRecipeUnlock2], timestamp);
        const response = await fetch(getURL("/api/recipeunlocks?recipeids=44"));
        assert.equal(response.status, 200);
        const json: IRecipeUnlock[] = await response.json();
        assert.equal(json.length, 1);
        assert.equal(json[0].recipe_id, 44);
        assert.equal(json[0].recipe_sheet_id, 100);
    });

    it("Returns two recipes on /recipes?resultitemids=44,45 and exclude one that does not match", async () => {
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
        const exampleRecipe3 = Object.assign({}, exampleRecipe, {
            ingredients: [{
                amount: 5,
                id: 37,
            }],
            results: [{
                amount: 5,
                id: 46,
            }],
        });
        const timestamp = new Date();
        await db.setTimestamp(timestamp);
        await db.saveRecipes([exampleRecipe, exampleRecipe2, exampleRecipe3], timestamp);
        const response = await fetch(getURL("/api/recipes?resultitemids=44,45"));
        assert.equal(response.status, 200);
        const json: IRecipe[] = await response.json();
        assert.equal(json.length, 2);
        const r1 = json[0].results[0];
        const r2 = json[1].results[0];
        assert(isRecipeItem(r1));
        assert(isRecipeItem(r2));
        if (isRecipeItem(r1) && isRecipeItem(r2)) {
            const ids = [r1.id, r2.id].sort();
            assert.deepEqual(ids, [44, 45]);
        }
    });

    it("Returns two recipes on /recipeunlocks?recipeids=44,45 and exclude one that does not match", async () => {
        const exampleRecipeUnlock2 = Object.assign({}, exampleRecipeUnlock, {
            recipe_id: 45,
            recipe_sheet_id: 101,
        });
        const exampleRecipeUnlock3 = Object.assign({}, exampleRecipeUnlock, {
            recipe_id: 46,
            recipe_sheet_id: 102,
        });
        const timestamp = new Date();
        await db.setTimestamp(timestamp);
        await db.saveRecipeUnlocks([exampleRecipeUnlock, exampleRecipeUnlock2, exampleRecipeUnlock3], timestamp);
        const response = await fetch(getURL("/api/recipeunlocks?recipeids=44,45"));
        assert.equal(response.status, 200);
        const json: IRecipeUnlock[] = await response.json();
        assert.equal(json.length, 2);
        assert.deepEqual(
            new Set(json.map((el) => el.recipe_id)),
            new Set([44, 45]));
        assert.deepEqual(
            new Set(json.map((el) => el.recipe_sheet_id)),
            new Set([100, 101]));
    });

    it("Rejects malformed /recipes?resultitemids=idlist", async () => {
        const response = await fetch(getURL("/api/recipes?resultitemids=aaa"));
        assert.equal(response.status, 400);
        const json = await response.json();
        assert.equal(json.shortcode, "wrong-resultitemids");
    });

    it("Rejects malformed /recipeunlocks?recipeids=idlist", async () => {
        const response = await fetch(getURL("/api/recipeunlocks?recipeids=aaa"));
        assert.equal(response.status, 400);
        const json = await response.json();
        assert.equal(json.shortcode, "wrong-resultitemids");
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

const exampleRecipeUnlock: IRecipeUnlock = {
    _id: null,
    recipe_id: 44,
    recipe_sheet_id: 100,
    timestamp: null,
};
