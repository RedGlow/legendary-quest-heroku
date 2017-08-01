import * as Rx from "rxjs/Rx";
import { IRecipe } from "../recipe";
import { transformRecipe as transformGW2Efficiency } from "../remoteparsers/gw2efficiency";
import { transformRecipe as transformGW2Profits } from "../remoteparsers/gw2profits";
import { transformRecipe as transformGW2Shinies } from "../remoteparsers/gw2shinies";
import { getRecipes as getGW2EfficiencyRecipes } from "../remoteservices/gw2efficiency";
import { getRecipes as getGW2ProfitsRecipes } from "../remoteservices/gw2profits";
import { getRecipes as getGW2ShiniesRecipes } from "../remoteservices/gw2shinies";

const produceRecipeBlocksObservable =
    <T>(getter: () => Rx.Observable<T[]>, transformer: ((myRecipe: T) => IRecipe)) =>
        getter().map((x) => x.map(transformer))
    ;

export const getRecipeBlocksObservable = () =>
    Rx.Observable.merge(
        produceRecipeBlocksObservable(getGW2EfficiencyRecipes, transformGW2Efficiency),
        produceRecipeBlocksObservable(getGW2ProfitsRecipes, transformGW2Profits),
        produceRecipeBlocksObservable(getGW2ShiniesRecipes, transformGW2Shinies))
    ;
