import * as assert from 'assert';
import { Recipe, RecipeItem, RecipeType } from '../recipe';
import { transformRecipes } from './gw2shinies';

describe('remoteparsers/gw2shinies', () => {
    it('can parse recipes', () => {
        var result = transformRecipes(example1);
        assert.deepEqual(result, [
            {
                _id: null,
                type: 'MysticForge',
                subtype: 'Blueprint',
                ingredients: [
                    { id: 21156, amount: 2 },
                    { id: 19700, amount: 5 },
                    { id: 19722, amount: 5 },
                    { id: 20798, amount: 1 }
                ],
                results: [
                    { id: 21260, amount: 1 }
                ],
                prerequisites: [],
                location: null,
                source: 'GW2Shinies',
                timestamp: null
            },
            {
                _id: null,
                type: 'MysticForge',
                subtype: 'Amulet',
                ingredients: [
                    { id: 23098, amount: 1 },
                    { id: 23097, amount: 1 },
                    { id: 23096, amount: 1 },
                    { id: 20799, amount: 50 }
                ],
                results: [
                    { id: 23095, amount: 1 }
                ],
                prerequisites: [],
                location: null,
                source: 'GW2Shinies',
                timestamp: null
            },
            {
                _id: null,
                type: 'MysticForge',
                subtype: 'CraftingMaterial',
                ingredients: [
                    { id: 24276, amount: 250 },
                    { id: 24277, amount: 1 },
                    { id: 20796, amount: 5 },
                    { id: 20799, amount: 5 }
                ],
                results: [
                    { id: 24277, amount: 6.91 }
                ],
                prerequisites: [],
                location: null,
                source: 'GW2Shinies',
                timestamp: null
            },
            {
                _id: null,
                type: 'MysticForge',
                subtype: 'Weapon',
                ingredients: [
                    { id: 19976, amount: 100 },
                    { id: 12976, amount: 250 },
                    { id: 19721, amount: 250 },
                    { id: 20852, amount: 1 }
                ],
                results: [
                    { id: 31058, amount: 1 }
                ],
                prerequisites: [],
                location: null,
                source: 'GW2Shinies',
                timestamp: null
            },
            {
                _id: null,
                type: 'MysticForge',
                subtype: 'Recipe',
                ingredients: [
                    { id: 19976, amount: 17 },
                    { id: 12196, amount: 1 },
                    { id: 19663, amount: 6 },
                    { id: 20799, amount: 9 }
                ],
                results: [
                    { id: 9731, amount: 1 }
                ],
                prerequisites: [],
                location: null,
                source: 'GW2Shinies',
                timestamp: null
            }
        ]);
    });
});

const example1 = [
    {
        "type": "blueprint",
        "target_recipe": "21260",
        "recipe_item_1": "21156",
        "recipe_item_1_quantity": "2",
        "recipe_item_2": "19700",
        "recipe_item_2_quantity": "5",
        "recipe_item_3": "19722",
        "recipe_item_3_quantity": "5",
        "recipe_item_4": "20798",
        "recipe_item_4_quantity": "1",
        "average_yield": "1"
    },
    {
        "type": "amulet",
        "target_recipe": "23095",
        "recipe_item_1": "23098",
        "recipe_item_1_quantity": "1",
        "recipe_item_2": "23097",
        "recipe_item_2_quantity": "1",
        "recipe_item_3": "23096",
        "recipe_item_3_quantity": "1",
        "recipe_item_4": "20799",
        "recipe_item_4_quantity": "50",
        "average_yield": "1"
    },
    {
        "type": "promo",
        "target_recipe": "24277",
        "recipe_item_1": "24276",
        "recipe_item_1_quantity": "250",
        "recipe_item_2": "24277",
        "recipe_item_2_quantity": "1",
        "recipe_item_3": "20796",
        "recipe_item_3_quantity": "5",
        "recipe_item_4": "20799",
        "recipe_item_4_quantity": "5",
        "average_yield": "6.91"
    },
    {
        "type": "weapon",
        "target_recipe": "31058",
        "recipe_item_1": "19976",
        "recipe_item_1_quantity": "100",
        "recipe_item_2": "12976",
        "recipe_item_2_quantity": "250",
        "recipe_item_3": "19721",
        "recipe_item_3_quantity": "250",
        "recipe_item_4": "20852",
        "recipe_item_4_quantity": "1",
        "average_yield": "1"
    },
    {
        "type": "recipe",
        "target_recipe": "9731",
        "recipe_item_1": "19976",
        "recipe_item_1_quantity": "17",
        "recipe_item_2": "12196",
        "recipe_item_2_quantity": "1",
        "recipe_item_3": "19663",
        "recipe_item_3_quantity": "6",
        "recipe_item_4": "20799",
        "recipe_item_4_quantity": "9",
        "average_yield": "1"
    }
];