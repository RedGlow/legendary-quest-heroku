import * as assert from "assert";
import * as Rx from "rxjs/Rx";
import { IRecipe } from "../recipe";
import { transformRecipe as transformGW2Efficiency } from "../remoteparsers/gw2efficiency";
import { transformRecipe as transformGW2Profits } from "../remoteparsers/gw2profits";
import { transformRecipe as transformGW2Recipes } from "../remoteparsers/gw2shinies";
import { getRecipes as getGW2EfficiencyRecipes } from "../remoteservices/gw2efficiency";
import { getRecipes as getGW2ProfitsRecipes } from "../remoteservices/gw2profits";
import { getRecipes as getGW2ShiniesRecipes } from "../remoteservices/gw2shinies";

// takes a generator of blocks of specific recipes, a transformer of specific recipes into generic ones,
// and checks that at least some result is returned
async function checkRecipesChain<T>(
    generator: () => Rx.Observable<T[]>,
    transformer: (recipes: T) => IRecipe)
    : Promise<void> {
    const result = await generator()
        .mergeMap((arr) => Rx.Observable.from(arr))
        .map(transformer)
        .toArray()
        .toPromise();
    assert(result.length > 0, "No result have been returned");
}

describe("Remote systems:", () => {
    it("can get GW2Shinies recipes", async () => {
        await checkRecipesChain(getGW2ShiniesRecipes, transformGW2Recipes);
    });
    it("can get GW2Efficiency recipes", async () => {
        await checkRecipesChain(getGW2EfficiencyRecipes, transformGW2Efficiency);
    });
    it("can get GW2Profits recipes", async () => {
        await checkRecipesChain(getGW2ProfitsRecipes, transformGW2Profits);
    });
});
