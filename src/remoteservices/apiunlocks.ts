import * as _ from "lodash";
import fetch from "node-fetch";
import * as parselinkheader from "parse-link-header";
import * as Rx from "rxjs/Rx";
import { get } from "../http";
import { feedObservable } from "./base";
import getLinkedUrlObservables, { FetchFunction } from "./linkedurlobservable";

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
        "https://api.guildwars2.com/v2/items?page_size=200&page=0",
        fetchFunction)
        .map((data: IMyRecipeUnlock[]) => _.filter(data, (item) =>
            !!item.details &&
            item.details.type === "Unlock" &&
            item.details.unlock_type === "CraftingRecipe"))
        .filter((data) => data.length > 0);
