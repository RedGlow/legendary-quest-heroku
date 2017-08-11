import { switchcase } from "../func";
import { IRecipe, IRecipeItem, RecipeType } from "../recipe";
import { IMyRecipe } from "../remoteservices/gw2shinies";

export const sourceName = "GW2Shinies";

const getSubtype = switchcase({
    /* tslint:disable:object-literal-key-quotes object-literal-sort-keys */
    "promo": "CraftingMaterial",
    "amulet": "Amulet",
    "weapon": "Weapon",
    "recipe": "Recipe",
    "blueprint": "Blueprint",
    /* tslint:enable:object-literal-key-quotes object-literal-sort-keys */
})((type) => { throw new Error(`Unknown type ${type}`); });

const makeElement = (id: string, amount: string): IRecipeItem => ({
    amount: parseFloat(amount),
    id: parseInt(id, 10),
});

export const transformRecipe = (recipe: IMyRecipe): IRecipe => ({
    _id: null,
    base_id: null,
    ingredients: [
        makeElement(recipe.recipe_item_1, recipe.recipe_item_1_quantity),
        makeElement(recipe.recipe_item_2, recipe.recipe_item_2_quantity),
        makeElement(recipe.recipe_item_3, recipe.recipe_item_3_quantity),
        makeElement(recipe.recipe_item_4, recipe.recipe_item_4_quantity),
    ],
    location: null,
    prerequisites: [],
    results: [makeElement(recipe.target_recipe, recipe.average_yield)],
    source: sourceName,
    subtype: getSubtype(recipe.type),
    timestamp: null,
    type: "MysticForge",
});
