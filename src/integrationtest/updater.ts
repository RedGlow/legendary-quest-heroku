import * as assert from "assert";
import * as Rx from "rxjs/Rx";
import { getRecipesForItems, setTimestamp } from "../db";
import { RecipeType } from "../recipe";
import { getRecipeBlocksObservable, update } from "../updater/updater";

describe("updater", () => {
    it("can merge together recipes from multiple sources", async () => {
        const recipes = await getRecipeBlocksObservable()
            .mergeMap((arr) => Rx.Observable.from(arr))
            .toArray()
            .toPromise();
        assert(recipes.find((recipe) => recipe.source === "GW2Shinies"));
        assert(recipes.find((recipe) => recipe.source === "GW2Profits"));
        assert(recipes.find((recipe) => recipe.source === "GW2Efficiency"));
    });

    it("Can add a single block of recipes", async () => {
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
});
