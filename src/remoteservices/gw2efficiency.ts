import * as Rx from "rxjs/Rx";
import { get } from "../http";
import { feedObservable } from "./base";

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

async function getRecipesPromise(observer: Rx.Observer<IMyRecipe[]>): Promise<void> {
    const moduleContent = await get("https://raw.githubusercontent.com/gw2efficiency" +
        "/recipe-calculation/master/src/static/vendorItems.js");
    const myModule: IModuleClass = { exports: null };
    /* tslint:disable:no-eval */
    (eval("(function(module) {\n" + moduleContent.replace("export default ", "module.exports = ") + "})"))(myModule);
    /* tslint:enable */
    const recipes = Object
        .keys(myModule.exports)
        .map((key: string) => ({ ...myModule.exports[parseInt(key, 10)], id: parseInt(key, 10) }));
    observer.next(recipes);
}

export const getRecipes = () => feedObservable(getRecipesPromise);
