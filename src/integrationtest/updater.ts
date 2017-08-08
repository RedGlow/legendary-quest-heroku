import * as assert from "assert";
import * as Rx from "rxjs/Rx";
import { getRecipesForItems, setTimestamp } from "../db";
import { RecipeType } from "../recipe";
import { doAll, getRecipeBlocksObservable, update } from "../updater/updater";
import { dropDb } from "./helpers";

describe("updater", () => {
    beforeEach(async () => {
        await dropDb();
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

    it("can add a single block of recipes", async () => {
        await setTimestamp(new Date());
        await update(Rx.Observable.from([[{
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
        }]]));
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
        assert.equal(recipes.length, 0);
        await doAll();
        const recipes2 = await getRecipesForItems(
            12337, // gw2efficiency
            29675, // gw2profits
            21260, // gw2shinies
        );
        assert(recipes2.length >= 3);
    });
});
