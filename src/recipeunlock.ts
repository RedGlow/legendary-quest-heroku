export interface IRecipeUnlock {
    _id: string;
    recipe_id: number;
    recipe_sheet_id: number;
    timestamp: Date;
}

export function setRecipeUnlockId(recipeUnlock: IRecipeUnlock) {
    recipeUnlock._id = recipeUnlock.recipe_id.toString();
}
