import * as _ from "lodash";
import fetch, { Request, Response } from "node-fetch";
import * as Rx from "rxjs/Rx";
import { feedObservable, fetchwrap } from "./base";

export interface IMyRecipe {
    type: string;
    target_recipe: string;
    recipe_item_1: string;
    recipe_item_1_quantity: string;
    recipe_item_2: string;
    recipe_item_2_quantity: string;
    recipe_item_3: string;
    recipe_item_3_quantity: string;
    recipe_item_4: string;
    recipe_item_4_quantity: string;
    average_yield: string;
}

export type FetchFunction = (url: string) => Promise<IMyRecipe[]>;

async function getRecipesPromise(
    observer: Rx.Observer<IMyRecipe[]>,
    fetchFunction: FetchFunction): Promise<void> {
    const rv = await fetchFunction("https://www.gw2shinies.com/api/json/forge/");
    observer.next(rv);
}

export const getRecipes = (fetchFunction: FetchFunction = fetchwrap<IMyRecipe[]>(fetch)) =>
    feedObservable(_.partialRight(getRecipesPromise, fetchFunction));
