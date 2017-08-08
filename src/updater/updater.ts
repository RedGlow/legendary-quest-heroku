import * as Rx from "rxjs/Rx";
import { IRecipe } from "../recipe";
import { IRecipeUnlock } from "../recipeunlock";
import { transformRecipeUnlock as transformAPIRecipeUnlock } from "../remoteparsers/apiunlocks";
import { transformRecipe as transformGW2Efficiency } from "../remoteparsers/gw2efficiency";
import { transformRecipe as transformGW2Profits } from "../remoteparsers/gw2profits";
import { transformRecipe as transformGW2Shinies } from "../remoteparsers/gw2shinies";
import { getRecipes as getAPIRecipeUnlocks } from "../remoteservices/apiunlocks";
import { getRecipes as getGW2EfficiencyRecipes } from "../remoteservices/gw2efficiency";
import { getRecipes as getGW2ProfitsRecipes } from "../remoteservices/gw2profits";
import { getRecipes as getGW2ShiniesRecipes } from "../remoteservices/gw2shinies";

import { close, saveRecipes, saveRecipeUnlocks, setTimestamp } from "../db";

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

const produceRecipeUnlockBlocksObservable =
    <T>(getter: () => Rx.Observable<T[]>, transformer: ((myRecipe: T) => IRecipeUnlock)) => {
        return getter().map((x) => x.map(transformer));
    };

export const getRecipeUnlockBlocksObservable = () =>
    produceRecipeUnlockBlocksObservable(getAPIRecipeUnlocks, transformAPIRecipeUnlock);

export const updateRecipes = async (
    recipeBlocks: Rx.Observable<IRecipe[]>,
    timestamp: Date) => {
    await recipeBlocks
        .map((recipeBlock) => saveRecipes(recipeBlock, timestamp))
        .toArray()
        .toPromise()
        .then((promises) => Promise.all(promises));
};

export const updateRecipeUnlocks = async (
    recipeUnlockBlocks: Rx.Observable<IRecipeUnlock[]>,
    timestamp: Date) => {
    await recipeUnlockBlocks
        .map((recipeUnlockBlock) => saveRecipeUnlocks(recipeUnlockBlock, timestamp))
        .toArray()
        .toPromise()
        .then((promises) => Promise.all(promises));
    await setTimestamp(timestamp);
};

export async function doAll() {
    try {
        const timestamp = new Date();
        /* tslint:disable:no-console */
        console.log("Starting the recipe feeder.");
        const observable = getRecipeBlocksObservable();
        console.log("Feeding it to the updater.");
        await updateRecipes(observable, timestamp);
        console.log("Starting the recipe unlock feeder.");
        const observableUnlocks = getRecipeUnlockBlocksObservable();
        console.log("Feeding it to the updater.");
        await updateRecipeUnlocks(observableUnlocks, timestamp);
        console.log("Setting timestamp");
        await setTimestamp(timestamp);
        console.log("Closing the connection.");
        await close();
        console.log("All done.");
    } catch (e) {
        console.error(e);
        /* tslint:enable:no-console */
    }
}
