import * as assert from "assert";
import { Db, MongoClient } from "mongodb";
import * as Rx from "rxjs/Rx";
import * as db from "../db";
import { IRecipe, isRecipeItem, RecipeType } from "../recipe";
import { dropDb } from "./helpers";

describe.only("db", () => {
    beforeEach(() => {
        return dropDb();
    });
    it("can save a recipe and immediately close", async () => {
        const timestamp = new Date();
        await db.saveRecipes([exampleRecipe], timestamp);
        await db.close();
    });
    it("can save a recipe, retrieve it and close", async () => {
        const timestamp = new Date();
        await db.setTimestamp(timestamp);
        await db.saveRecipes([exampleRecipe], timestamp);
        const recipes = await db.getRecipesForItems(44);
        assert.equal(recipes.length, 1);
        assert.deepEqual(recipes[0].timestamp, timestamp);
        assert.equal(recipes[0].results.length, 1);
        const r = recipes[0].results[0];
        assert(isRecipeItem(r));
        if (isRecipeItem(r)) {
            assert.equal(r.id, 44);
        }
        await db.close();
    });
    it("fails to retrieve a non-existing timestamp", async () => {
        try {
            await db.getTimestamp();
            assert.fail("db.getTimestamp() without a db.setTimestamp should fail.");
        } catch (e) {
            const error = e;
            assert(error instanceof db.NoTimestampError);
        }
    });
    it("correctly retrieves a timestamp", async () => {
        const timestamp = new Date();
        await db.setTimestamp(timestamp);
        const returnedTimestamp = await db.getTimestamp();
        assert.deepEqual(timestamp, returnedTimestamp);
    });
    it("correctly updates a timestamp", async () => {
        const timestamp = new Date();
        await db.setTimestamp(timestamp);
        const timestamp2 = new Date();
        timestamp2.setDate(timestamp2.getDate() + 1);
        assert.notEqual(timestamp, timestamp2);
        await db.setTimestamp(timestamp2);
        const returnedTimestamp = await db.getTimestamp();
        assert.deepEqual(timestamp2, returnedTimestamp);
        // internal check: no old timestamp lying around
        const timestamps = await (await getDb()).collection("Timestamp").find({}).toArray();
        assert.equal(timestamps.length, 1);
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

const getDb = () => {
    const url = process.env.MONGODB_URI ||
        "mongodb://legendaryquest:legendaryquest@localhost:27017/legendaryquest";
    return new Promise<Db>((resolve, reject) => {
        MongoClient.connect(url, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};
