import * as _ from "lodash";
import * as Rx from "rxjs/Rx";
import { cleanRecipes, cleanRecipeUnlocks, close, saveRecipes, saveRecipeUnlocks, setTimestamp } from "../db";
import { IRecipe } from "../recipe";
import { IRecipeUnlock } from "../recipeunlock";
import { transformRecipeUnlock as transformAPIRecipeUnlock } from "../remoteparsers/apiunlocks";
import {
    sourceName as GW2EfficiencySourceName,
    transformRecipe as transformGW2Efficiency,
} from "../remoteparsers/gw2efficiency";
import {
    sourceName as GW2ProfitsSourceName,
    transformRecipe as transformGW2Profits,
} from "../remoteparsers/gw2profits";
import {
    sourceName as GW2ShiniesSourceName,
    transformRecipe as transformGW2Shinies,
} from "../remoteparsers/gw2shinies";
import { getRecipes as getAPIRecipeUnlocks } from "../remoteservices/apiunlocks";
import { getRecipes as getGW2EfficiencyRecipes } from "../remoteservices/gw2efficiency";
import { getRecipes as getGW2ProfitsRecipes } from "../remoteservices/gw2profits";
import { getRecipes as getGW2ShiniesRecipes } from "../remoteservices/gw2shinies";

export const produceObservable =
    <T, U>(
        getter: () => Rx.Observable<T[]>,
        transformer: ((myRecipe: T) => U),
        errorCallback: () => void) => {
        const recoverer = (e: Error) => {
            /* tslint:disable:no-console */
            // we log the errors and proceed returning nothing.
            console.error(e);
            errorCallback();
            return Rx.Observable.from([[]] as U[][]);
            /* tslint:enable:no-console */
        };
        try {
            return getter()
                .map((x) => x.map(transformer))
                .catch(recoverer);
        } catch (e) {
            return recoverer(e);
        }
    };

export const getRecipeBlocksObservable = (errorCallback: (name: string) => void) =>
    Rx.Observable.merge(
        produceObservable(
            getGW2EfficiencyRecipes,
            transformGW2Efficiency,
            _.partial(errorCallback, GW2EfficiencySourceName)),
        produceObservable(
            getGW2ProfitsRecipes,
            transformGW2Profits,
            _.partial(errorCallback, GW2ProfitsSourceName)),
        produceObservable(
            getGW2ShiniesRecipes,
            transformGW2Shinies,
            _.partial(errorCallback, GW2ShiniesSourceName)));

export const getRecipeUnlockBlocksObservable = (errorCallback: () => void) =>
    produceObservable(getAPIRecipeUnlocks, transformAPIRecipeUnlock, errorCallback);

export const updateRecipes = async (
    recipeBlocks: Rx.Observable<IRecipe[]>,
    timestamp: Date) => {
    await recipeBlocks
        .map(async (recipeBlock) => {
            if (recipeBlock.length > 0) {
                await saveRecipes(recipeBlock, timestamp);
            }
        })
        .toArray()
        .toPromise()
        .then((promises) => Promise.all(promises));
};

export const updateRecipeUnlocks = async (
    recipeUnlockBlocks: Rx.Observable<IRecipeUnlock[]>,
    timestamp: Date) => {
    await recipeUnlockBlocks
        .map(async (recipeUnlockBlock) => {
            if (recipeUnlockBlock.length > 0) {
                await saveRecipeUnlocks(recipeUnlockBlock, timestamp);
            }
        })
        .toArray()
        .toPromise()
        .then((promises) => Promise.all(promises));
};

export async function doAll() {
    try {
        const timestamp = new Date();
        /* tslint:disable:no-console */
        console.log("Starting the recipe feeder.");
        const errorred: string[] = [];
        const observable = getRecipeBlocksObservable(errorred.push.bind(errorred));
        console.log("Feeding it to the updater.");
        await updateRecipes(observable, timestamp);
        console.log("Starting the recipe unlock feeder.");
        let recipeUnlocksErrorred = false;
        const observableUnlocks = getRecipeUnlockBlocksObservable(() => { recipeUnlocksErrorred = true; });
        console.log("Feeding it to the updater.");
        await updateRecipeUnlocks(observableUnlocks, timestamp);
        console.log("Setting timestamp");
        await setTimestamp(timestamp);
        console.log("Cleaning old data.");
        console.log("Errored entries:" + errorred.join(", "));
        await Promise.all(
            [GW2EfficiencySourceName, GW2ProfitsSourceName, GW2ShiniesSourceName]
                .filter((name) => !_.includes(errorred, name))
                .map((name) => cleanRecipes(name, timestamp)));
        if (!recipeUnlocksErrorred) {
            await cleanRecipeUnlocks(timestamp);
        }
        console.log("Closing the connection.");
        await close();
        console.log("All done.");
    } catch (e) {
        console.error(e);
        /* tslint:enable:no-console */
    }
}
