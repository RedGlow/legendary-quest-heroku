import * as Rx from 'rxjs/Rx';
import { feedObservable } from './base';
import { get } from '../http';

interface ModuleClass {
    exports: { [idx: number]: MyRecipe };
}

interface InternalRecipe {
    type: string;
    quantity: number;
    cost: number;
    npcs: NPC[]
}

interface MyRecipe extends InternalRecipe {
    id: number;
}

interface NPC {
    name: string;
    position: string;
}

async function getRecipesPromise(observer: Rx.Observer<MyRecipe[]>): Promise<void> {
    var moduleContent = await get("https://raw.githubusercontent.com/gw2efficiency/recipe-calculation/master/src/static/vendorItems.js");
    var myModule: ModuleClass = { exports: null };
    (eval("(function(module) {\n" + moduleContent.replace("export default ", "module.exports = ") + "})"))(myModule);
    var recipes = Object
        .keys(myModule.exports)
        .map((key: string) => ({ ...myModule.exports[parseInt(key)], id: parseInt(key) }));
    observer.next(recipes);
}

export function getRecipes(): Rx.Observable<MyRecipe[]> {
    return feedObservable(getRecipesPromise);
}