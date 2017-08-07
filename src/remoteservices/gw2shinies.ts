import fetch, { Request, Response } from "node-fetch";
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

export type FetchFunction = (url: string) => Promise<IMyRecipe[]>;

async function getRecipesPromise(
    observer: Rx.Observer<IMyRecipe[]>,
    fetchFunction: FetchFunction): Promise<void> {
    const rv = await fetchFunction("https://www.gw2shinies.com/api/json/forge/");
    observer.next(rv);
}

export const wrap = <T>(f: (url: string | Request, init?: RequestInit) => Promise<Response>) =>
    (url: string) => f(url).then((response) =>
        response.status >= 200 && response.status < 300 ?
            response.json() as Promise<T> :
            response.text().then((t) => Promise.reject(t)));

export const getRecipes = (fetchFunction: FetchFunction = wrap<IMyRecipe[]>(fetch)) =>
    feedObservable((observer) => getRecipesPromise(observer, fetchFunction));
