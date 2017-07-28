import { getJSON } from '../http';
import { Recipe, RecipeItem, RecipeType } from '../recipe';
import { MyRecipe } from '../remoteservices/gw2shinies';

function getSubtype(type: string): string {
    switch (type) {
        case 'promo': return 'CraftingMaterial';
        case 'amulet': return 'Amulet';
        case 'weapon': return 'Weapon';
        case 'recipe': return 'Recipe';
        case 'blueprint': return 'Blueprint';
        default: throw new Error(`Unknown type ${type}`);
    }
}

function makeElement(id: string, amount: string): RecipeItem {
    return {
        id: parseInt(id),
        amount: parseFloat(amount)
    };
}

function getConstantType(): RecipeType {
    return 'MysticForge';
}

export function transformRecipes(recipes: MyRecipe[]): Recipe[] {
    return recipes.map(recipe => ({
        _id: null,
        type: getConstantType(),
        subtype: getSubtype(recipe.type),
        ingredients: [
            makeElement(recipe.recipe_item_1, recipe.recipe_item_1_quantity),
            makeElement(recipe.recipe_item_2, recipe.recipe_item_2_quantity),
            makeElement(recipe.recipe_item_3, recipe.recipe_item_3_quantity),
            makeElement(recipe.recipe_item_4, recipe.recipe_item_4_quantity),
        ],
        results: [makeElement(recipe.target_recipe, recipe.average_yield)],
        prerequisites: [],
        location: null,
        source: 'GW2Shinies',
        timestamp: null
    }));
}