import * as assert from "assert";
import * as Rx from "rxjs/Rx";
import { getRecipeBlocksObservable } from "../updater/updater";

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
});
