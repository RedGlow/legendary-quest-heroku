import { getJSON } from "../http";
import { IRecipe, IRecipeItem, RecipeType } from "../recipe";
import { IMyRecipe } from "../remoteservices/gw2shinies";

function getSubtype(type: string): string {
    switch (type) {
        case "promo": return "CraftingMaterial";
        case "amulet": return "Amulet";
        case "weapon": return "Weapon";
        case "recipe": return "Recipe";
        case "blueprint": return "Blueprint";
        default: throw new Error(`Unknown type ${type}`);
    }
}

function makeElement(id: string, amount: string): IRecipeItem {
    return {
        amount: parseFloat(amount),
        id: parseInt(id, 10),
    };
}

function getConstantType(): RecipeType {
    return "MysticForge";
}

export const transformRecipe = (recipe: IMyRecipe): IRecipe => ({
    _id: null,
    ingredients: [
        makeElement(recipe.recipe_item_1, recipe.recipe_item_1_quantity),
        makeElement(recipe.recipe_item_2, recipe.recipe_item_2_quantity),
        makeElement(recipe.recipe_item_3, recipe.recipe_item_3_quantity),
        makeElement(recipe.recipe_item_4, recipe.recipe_item_4_quantity),
    ],
    location: null,
    prerequisites: [],
    results: [makeElement(recipe.target_recipe, recipe.average_yield)],
    source: "GW2Shinies",
    subtype: getSubtype(recipe.type),
    timestamp: null,
    type: getConstantType(),
});
