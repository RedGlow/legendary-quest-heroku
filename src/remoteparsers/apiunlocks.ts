import { extract } from "../func";
import { IRecipeUnlock } from "../recipeunlock";
import { IMyRecipeUnlock } from "../remoteservices/apiunlocks";

export const transformRecipeUnlock = (recipeUnlock: IMyRecipeUnlock): IRecipeUnlock => ({
    _id: "",
    recipe_id: extract(extract(recipeUnlock.details).recipe_id),
    recipe_sheet_id: recipeUnlock.id,
    timestamp: new Date(0),
});
