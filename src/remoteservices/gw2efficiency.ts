import * as _ from "lodash";
import fetch, { Request, Response } from "node-fetch";
import * as Rx from "rxjs/Rx";
import get from "../configuration";
import { feedObservable, fetchwraptext } from "./base";

interface IModuleClass {
    exports: { [idx: number]: IMyRecipe };
}

interface InternalRecipe {
    type: string;
    quantity: number;
    cost: number;
    npcs: INPC[];
}

export interface IMyRecipe extends InternalRecipe {
    id: number;
}

interface INPC {
    name: string;
    position: string;
}

export type FetchFunction = (url: string) => Promise<string>;

async function getRecipesPromise(
    observer: Rx.Observer<IMyRecipe[]>,
    fetchFunction: FetchFunction): Promise<void> {
    const moduleContent = await fetchFunction(get().remoteServices.gw2EfficiencyUrl);
    const myModule: IModuleClass = { exports: {} };
    const exportsModule = "(function(module) {\n" +
        moduleContent.replace("export default ", "module.exports = ")
        + "})";
    /* tslint:disable:no-eval */
    eval(exportsModule)(myModule);
    /* tslint:enable */
    const recipes = Object
        .keys(myModule.exports)
        .map((key: string) => {
            const parsedKey = parseInt(key, 10);
            return { ...myModule.exports[parsedKey], id: parsedKey };
        });
    observer.next(recipes);
}

export const getRecipes = (fetchFunction: FetchFunction = fetchwraptext(fetch)) =>
    feedObservable(_.partialRight(getRecipesPromise, fetchFunction));
