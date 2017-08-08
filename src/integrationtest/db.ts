import * as assert from "assert";
import { Db, MongoClient } from "mongodb";
import * as Rx from "rxjs/Rx";
import * as db from "../db";
import { IRecipe, IRecipeItem, isRecipeItem, RecipeType } from "../recipe";
import { IRecipeUnlock } from "../recipeunlock";
import { dropDb } from "./helpers";

describe("db", () => {
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
    it("can save a recipe, update it, clean, and only have one recipe on the db", async () => {
        const timestamp = new Date();
        await db.setTimestamp(timestamp);
        let recipes = await db.getRecipesForItems(44);
        assert.equal(recipes.length, 0);

        await db.saveRecipes([exampleRecipe], timestamp);
        recipes = await db.getRecipesForItems(44);
        assert.equal(recipes.length, 1);

        const timestamp2 = new Date(timestamp.getTime() + 1000 * 60);
        assert.notDeepEqual(timestamp, timestamp2);
        assert(timestamp2 > timestamp);
        const exampleRecipe2 = {
            ...exampleRecipe, ingredients: [{
                amount: 5,
                id: 33,
            }],
        };
        await db.setTimestamp(timestamp2);
        await db.saveRecipes([exampleRecipe2], timestamp2);
        recipes = await db.getRecipesForItems(44);
        assert.equal(recipes.length, 1);
        assert.equal((recipes[0].ingredients[0] as IRecipeItem).amount, 5);
        const mongoDb = await db.connect();
        let num = await mongoDb
            .collection("Recipes")
            .count({ "results.id": 44 });
        assert.equal(num, 2);

        await db.cleanRecipes(timestamp2);
        recipes = await db.getRecipesForItems(44);
        assert.equal(recipes.length, 1);
        assert.equal((recipes[0].ingredients[0] as IRecipeItem).amount, 5);
        num = await mongoDb
            .collection("Recipes")
            .count({ "results.id": 44 });
        assert.equal(num, 1);
    });
    it("can save a recipe unlock, update it, clean, and only have one recipe unlock on the db", async () => {
        const timestamp = new Date();
        await db.setTimestamp(timestamp);
        let recipeUnlocks = await db.getRecipeUnlocksForIds(44);
        assert.equal(recipeUnlocks.length, 0);

        await db.saveRecipeUnlocks([exampleRecipeUnlock], timestamp);
        recipeUnlocks = await db.getRecipeUnlocksForIds(44);
        assert.equal(recipeUnlocks.length, 1);

        const timestamp2 = new Date(timestamp.getTime() + 1000 * 60);
        assert.notDeepEqual(timestamp, timestamp2);
        assert(timestamp2 > timestamp);
        const exampleRecipeUnlock2 = {
            ...exampleRecipeUnlock, recipe_sheet_id: 101,
        };
        await db.setTimestamp(timestamp2);
        await db.saveRecipeUnlocks([exampleRecipeUnlock2], timestamp2);
        recipeUnlocks = await db.getRecipeUnlocksForIds(44);
        assert.equal(recipeUnlocks.length, 1);
        assert.equal(recipeUnlocks[0].recipe_sheet_id, 101);
        const mongoDb = await db.connect();
        let num = await mongoDb
            .collection("RecipeUnlocks")
            .count({ recipe_id: 44 });
        assert.equal(num, 2);

        await db.cleanRecipeUnlocks(timestamp2);
        recipeUnlocks = await db.getRecipeUnlocksForIds(44);
        assert.equal(recipeUnlocks.length, 1);
        assert.equal(recipeUnlocks[0].recipe_sheet_id, 101);
        num = await mongoDb
            .collection("RecipeUnlocks")
            .count({ recipe_id: 44 });
        assert.equal(num, 1);
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

const exampleRecipeUnlock: IRecipeUnlock = {
    _id: null,
    recipe_id: 44,
    recipe_sheet_id: 100,
    timestamp: null,
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
