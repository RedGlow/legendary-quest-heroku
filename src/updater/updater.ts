import * as Rx from "rxjs/Rx";
import { IRecipe } from "../recipe";
import { transformRecipe as transformGW2Efficiency } from "../remoteparsers/gw2efficiency";
import { transformRecipe as transformGW2Profits } from "../remoteparsers/gw2profits";
import { transformRecipe as transformGW2Shinies } from "../remoteparsers/gw2shinies";
import { getRecipes as getGW2EfficiencyRecipes } from "../remoteservices/gw2efficiency";
import { getRecipes as getGW2ProfitsRecipes } from "../remoteservices/gw2profits";
import { getRecipes as getGW2ShiniesRecipes } from "../remoteservices/gw2shinies";

import { close, saveRecipes, setTimestamp } from "../db";

const produceRecipeBlocksObservable =
    <T>(getter: () => Rx.Observable<T[]>, transformer: ((myRecipe: T) => IRecipe)) =>
        getter().map((x) => x.map(transformer))
    ;

export const getRecipeBlocksObservable = () =>
    Rx.Observable.merge(
        produceRecipeBlocksObservable(getGW2EfficiencyRecipes, transformGW2Efficiency),
        produceRecipeBlocksObservable(getGW2ProfitsRecipes, transformGW2Profits),
        produceRecipeBlocksObservable(getGW2ShiniesRecipes, transformGW2Shinies))
    ;

export const update = async (recipeBlocks: Rx.Observable<IRecipe[]>) => {
    const timestamp = new Date();
    await recipeBlocks
        .map((recipeBlock) => saveRecipes(recipeBlock, timestamp))
        .toArray()
        .toPromise()
        .then((promises) => Promise.all(promises));
    await setTimestamp(timestamp);
};

export async function doAll() {
    try {
        /* tslint:disable:no-console */
        console.log("Starting the recipe feeder.");
        const observable = getRecipeBlocksObservable();
        console.log("Feeding it to the updater.");
        await update(observable);
        console.log("Closing the connection.");
        await close();
        console.log("All done.");
    } catch (e) {
        console.error(e);
        /* tslint:enable:no-console */
    }
}
