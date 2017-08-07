import * as Rx from "rxjs/Rx";
import { getJSON } from "../http";
import { feedObservable } from "./base";

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

async function getRecipesPromise(observer: Rx.Observer<IMyRecipe[]>): Promise<void> {
    const rv = await getJSON<IMyRecipe[]>("https://www.gw2shinies.com/api/json/forge/");
    observer.next(rv);
}

export const getRecipes = () => feedObservable(getRecipesPromise);
