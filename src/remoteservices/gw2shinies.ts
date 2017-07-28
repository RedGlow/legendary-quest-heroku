import { getJSON } from '../http';

export interface MyRecipe {
    type: string;
    target_recipe: string;
    recipe_item_1: string;
    recipe_item_1_quantity: string;
    recipe_item_2: string;
    recipe_item_2_quantity: string;
    recipe_item_3: string;
    recipe_item_3_quantity: string;
    recipe_item_4: string;
    recipe_item_4_quantity: string;
    average_yield: string;
}

export async function getRecipes(): Promise<MyRecipe[]> {
    return await getJSON<MyRecipe[]>('https://www.gw2shinies.com/api/json/forge/');
}