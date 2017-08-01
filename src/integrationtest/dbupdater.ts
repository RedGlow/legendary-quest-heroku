import * as assert from "assert";
import * as Rx from "rxjs/Rx";
import { getRecipesForItems, setTimestamp } from "../db";
import { RecipeType } from "../recipe";
import { update } from "../updater/dbupdater";

describe("dbupdater", () => {
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
