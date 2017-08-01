import * as Rx from "rxjs/Rx";
import { saveRecipes, setTimestamp } from "../db";
import { IRecipe } from "../recipe";
import { getRecipeBlocksObservable } from "./updater";

export const update = async (recipeBlocks: Rx.Observable<IRecipe[]>) => {
    const timestamp = new Date();
    await recipeBlocks
        .map((recipeBlock) => saveRecipes(recipeBlock, timestamp))
        .toArray()
        .toPromise()
        .then((promises) => Promise.all(promises));
    setTimestamp(timestamp);
};
