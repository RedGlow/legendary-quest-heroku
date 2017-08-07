import * as Rx from "rxjs/Rx";
import { getJSON } from "../http";
import { feedObservable } from "./base";

export interface IMyRecipe {
    name: string;
    type: string;
    disciplines: string[];
    output_item_id: number;
    output_item_count: number;
    ingredients: IMyIngredient[];
}

export interface IMyIngredient {
    item_id: number;
    count: number;
}

async function getRecipesPromise(observer: Rx.Observer<IMyRecipe[]>): Promise<void> {
    const rv = (await getJSON<IMyRecipe[]>("http://gw2profits.com/json/v2/forge"))
        .filter((recipe) => recipe.disciplines.indexOf("Achievement") === -1);
    observer.next(rv);
}

export const getRecipes = () => feedObservable(getRecipesPromise);
