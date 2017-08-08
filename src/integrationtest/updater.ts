import * as assert from "assert";
import * as Rx from "rxjs/Rx";
import { getRecipesForItems, getRecipeUnlocksForIds, setTimestamp } from "../db";
import { RecipeType } from "../recipe";
import { setStartingPage } from "../remoteservices/apiunlocks";
import { setMaxPages } from "../remoteservices/linkedurlobservable";
import {
    doAll,
    getRecipeBlocksObservable,
    getRecipeUnlockBlocksObservable,
    produceObservable,
    updateRecipes,
} from "../updater/updater";
import { dropDb } from "./helpers";

describe("updater", () => {
    beforeEach(async () => {
        setStartingPage(38);
        setMaxPages(1);
        await dropDb();
    });

    afterEach(() => {
        setStartingPage(0);
        setMaxPages(-1);
    });

    it("can recover from partial errors", async () => {
        const getter: () => Rx.Observable<number[]> = () => {
            throw new Error("This error should appear in console but not cause a test failure.");
        };
        const transformer = (n: number) => n;
        const result = await produceObservable(getter, transformer)
            .toArray()
            .toPromise();
        assert.deepEqual(result, [[]]);
    });

    it("can merge together recipes from multiple sources", async () => {
        const recipes = await getRecipeBlocksObservable()
            .mergeMap((arr) => Rx.Observable.from(arr))
            .toArray()
            .toPromise();
        assert(recipes.find((recipe) => recipe.source === "GW2Shinies"));
        assert(recipes.find((recipe) => recipe.source === "GW2Profits"));
        assert(recipes.find((recipe) => recipe.source === "GW2Efficiency"));
    });

    it("can merge together recipe unlocks from multiple sources", async () => {
        const recipeUnlocks = await getRecipeUnlockBlocksObservable()
            .mergeMap((arr) => Rx.Observable.from(arr))
            .toArray()
            .toPromise();
        assert(recipeUnlocks.length > 0);
    });

    it("can add a single block of recipes", async () => {
        const timestamp = new Date();
        await setTimestamp(timestamp);
        await updateRecipes(Rx.Observable.from([[{
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
        }]]), timestamp);
        const recipes = await getRecipesForItems(44);
        assert.equal(recipes.length, 1);
        assert.deepEqual(recipes[0].ingredients, [{
            amount: 4,
            id: 33,
        }]);
    });

    it("can do all", async () => {
        await setTimestamp(new Date());
        const recipes = await getRecipesForItems(
            12337, // gw2efficiency
            29675, // gw2profits
            21260, // gw2shinies
        );
        const recipeUnlocks = await getRecipeUnlocksForIds(2841);
        assert.equal(recipes.length, 0);
        assert.equal(recipeUnlocks.length, 0);
        await doAll();
        const recipes2 = await getRecipesForItems(
            12337, // gw2efficiency
            29675, // gw2profits
            21260, // gw2shinies
        );
        const recipeUnlocks2 = await getRecipeUnlocksForIds(2841);
        assert(recipes2.length >= 3);
        assert(recipeUnlocks2.length >= 1);
    });
});
