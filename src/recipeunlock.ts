export interface IRecipeUnlock {
    _id: string;
    recipe_id: number;
    recipe_sheet_id: number;
    timestamp: Date;
}

export const getRecipeUnlockId = (ru: IRecipeUnlock) =>
    ru.recipe_id.toString() + "=" + ru.recipe_sheet_id.toString();

export function setRecipeUnlockId(recipeUnlock: IRecipeUnlock) {
    recipeUnlock._id = recipeUnlock.recipe_id.toString();
}
