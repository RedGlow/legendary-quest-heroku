import { IRecipeUnlock } from "../recipeunlock";
import { IMyRecipeUnlock } from "../remoteservices/apiunlocks";

export const transformRecipeUnlock = (recipeUnlock: IMyRecipeUnlock): IRecipeUnlock => ({
    _id: null,
    recipe_id: recipeUnlock.details.recipe_id,
    recipe_sheet_id: recipeUnlock.id,
    timestamp: null,
});
