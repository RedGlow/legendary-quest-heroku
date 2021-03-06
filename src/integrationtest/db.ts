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
        await db.saveRecipes([exampleRecipe2], timestamp2);
        recipes = await db.getRecipesForItems(44);
        assert.equal(recipes.length, 1);
        assert.equal((recipes[0].ingredients[0] as IRecipeItem).amount, 5);
        const mongoDb = await db.connect();
        let num = await mongoDb
            .collection("Recipes")
            .count({ "results.id": 44 });
        assert.equal(num, 2);

        await db.cleanRecipes("MySource", timestamp2);
        recipes = await db.getRecipesForItems(44);
        assert.equal(recipes.length, 1);
        assert.equal((recipes[0].ingredients[0] as IRecipeItem).amount, 5);
        num = await mongoDb
            .collection("Recipes")
            .count({ "results.id": 44 });
        assert.equal(num, 1);
    });
    it("can handle the cleaning mechanism without losing recipes", async () => {
        // initialize
        const mongoDb = await db.connect();
        const timestamp = new Date();
        const timestamp2 = new Date(timestamp.getTime() + 1000 * 60);
        const source1 = exampleRecipe.source;
        const source2 = exampleRecipe.source + "2";
        // add a new recipe and check the db api and raw database search agree on that
        await db.saveRecipes([exampleRecipe], timestamp);
        const recipes1 = await db.getRecipesForItems(44);
        assert.equal(recipes1.length, 1);
        const num1 = await mongoDb
            .collection("Recipes")
            .count({ "results.id": 44 });
        assert.equal(num1, 1);
        // add a recipe from another source for another item
        const exampleRecipe2 = {
            ...exampleRecipe,
            results: [{ ...exampleRecipe.results[0], id: 45 }],
            source: source2,
        };
        await db.saveRecipes([exampleRecipe2], timestamp);
        const recipes2 = await db.getRecipesForItems(45);
        assert.equal(recipes2.length, 1);
        const num2 = await mongoDb
            .collection("Recipes")
            .count({ "results.id": 45 });
        assert.equal(num2, 1);
        // add a newer recipe to the first id
        await db.saveRecipes([exampleRecipe], timestamp2);
        const recipes3 = await db.getRecipesForItems(44);
        assert.equal(recipes3.length, 1);
        const num3 = await mongoDb
            .collection("Recipes")
            .count({ "results.id": 44 });
        assert.equal(num3, 2);
        // clean the old recipes only for one source
        await db.cleanRecipes(source1, timestamp2);
        // check that there are two recipes from two different sources and for two different items
        const recipes4 = await db.getRecipesForItems(45);
        assert.equal(recipes4.length, 1);
        assert.equal(recipes4[0].source, source2);
        const num4 = await mongoDb
            .collection("Recipes")
            .count({ "results.id": 45 });
        assert.equal(num4, 1);
        const recipes5 = await db.getRecipesForItems(44);
        assert.equal(recipes5.length, 1);
        const num5 = await mongoDb
            .collection("Recipes")
            .count({ "results.id": 44 });
        assert.equal(num5, 1);
    });
    it("can save a recipe unlock, update it, clean, and only have one recipe unlock on the db", async () => {
        const timestamp = new Date();
        let recipeUnlocks = await db.getRecipeUnlocksForIds(44);
        assert.equal(recipeUnlocks.length, 0);

        await db.saveRecipeUnlocks([exampleRecipeUnlock], timestamp);
        recipeUnlocks = await db.getRecipeUnlocksForIds(44);
        assert.equal(recipeUnlocks.length, 1);

        const timestamp2 = new Date(timestamp.getTime() + 1000 * 60);
        assert.notDeepEqual(timestamp, timestamp2);
        assert(timestamp2 > timestamp);
        await db.saveRecipeUnlocks([exampleRecipeUnlock], timestamp2);
        recipeUnlocks = await db.getRecipeUnlocksForIds(44);
        assert.equal(recipeUnlocks.length, 1);
        assert.equal(recipeUnlocks[0].recipe_sheet_id, 100);
        const mongoDb = await db.connect();
        let num = await mongoDb
            .collection("RecipeUnlocks")
            .count({ recipe_id: 44 });
        assert.equal(num, 2);

        await db.cleanRecipeUnlocks(timestamp2);
        recipeUnlocks = await db.getRecipeUnlocksForIds(44);
        assert.equal(recipeUnlocks.length, 1);
        assert.equal(recipeUnlocks[0].recipe_sheet_id, 100);
        num = await mongoDb
            .collection("RecipeUnlocks")
            .count({ recipe_id: 44 });
        assert.equal(num, 1);
    });
});

const exampleRecipe: IRecipe = {
    _id: "",
    base_id: "",
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
    timestamp: new Date(0),
    type: "Vendor" as RecipeType,
};

const exampleRecipeUnlock: IRecipeUnlock = {
    _id: "",
    recipe_id: 44,
    recipe_sheet_id: 100,
    timestamp: new Date(0),
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
