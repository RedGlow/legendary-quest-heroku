import * as _ from "lodash";
import fetch from "node-fetch";
import * as parselinkheader from "parse-link-header";
import * as Rx from "rxjs/Rx";
import get from "../configuration";
import { feedObservable } from "./base";
import getLinkedUrlObservables, { FetchFunction } from "./linkedurlobservable";

let startingPage: number = 0;

export function setStartingPage(newStartingPage: number) {
    startingPage = newStartingPage;
}

export interface IMyRecipeUnlock {
    id: number;
    details?: IItemDetails;
}

interface IItemDetails {
    type?: string;
    unlock_type?: string;
    recipe_id?: number;
}

export const getRecipes = (
    fetchFunction: FetchFunction<IMyRecipeUnlock[]> = void 0):
    Rx.Observable<IMyRecipeUnlock[]> =>
    getLinkedUrlObservables<IMyRecipeUnlock[]>(
        get().remoteServices.apiUrl.replace("${startingPage}", startingPage.toString()),
        fetchFunction)
        .map((data: IMyRecipeUnlock[]) => _.filter(data, (item) =>
            !!item.details &&
            item.details.type === "Unlock" &&
            item.details.unlock_type === "CraftingRecipe"))
        .filter((data) => data.length > 0);
