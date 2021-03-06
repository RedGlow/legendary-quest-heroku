import * as _ from "lodash";
import fetch, { Request, Response } from "node-fetch";
import * as Rx from "rxjs/Rx";
import get from "../configuration";
import { feedObservable, fetchwrap } from "./base";

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

export type FetchFunction = (url: string) => Promise<IMyRecipe[]>;

async function getRecipesPromise(
    observer: Rx.Observer<IMyRecipe[]>,
    fetchFunction: FetchFunction): Promise<void> {
    const rv = (await fetchFunction(get().remoteServices.gw2ProfitsUrl))
        .filter((recipe) => recipe.disciplines.indexOf("Achievement") === -1);
    observer.next(rv);
}

export const getRecipes = (fetchFunction: FetchFunction = fetchwrap<IMyRecipe[]>(fetch)) =>
    feedObservable(_.partialRight(getRecipesPromise, fetchFunction));
