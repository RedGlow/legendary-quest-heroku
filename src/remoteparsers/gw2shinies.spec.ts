import * as assert from "assert";
import { IRecipe, IRecipeItem, RecipeType } from "../recipe";
import { transformRecipe } from "./gw2shinies";

describe("remoteparsers/gw2shinies", () => {
    it("can parse recipes", () => {
        const result = example1.map(transformRecipe);
        assert.deepEqual(result, [
            {
                _id: "",
                base_id: "",
                ingredients: [
                    { id: 21156, amount: 2 },
                    { id: 19700, amount: 5 },
                    { id: 19722, amount: 5 },
                    { id: 20798, amount: 1 },
                ],
                location: null,
                prerequisites: [],
                results: [
                    { id: 21260, amount: 1 },
                ],
                source: "GW2Shinies",
                subtype: "Blueprint",
                timestamp: new Date(0),
                type: "MysticForge",
            },
            {
                _id: "",
                base_id: "",
                ingredients: [
                    { id: 23098, amount: 1 },
                    { id: 23097, amount: 1 },
                    { id: 23096, amount: 1 },
                    { id: 20799, amount: 50 },
                ],
                location: null,
                prerequisites: [],
                results: [
                    { id: 23095, amount: 1 },
                ],
                source: "GW2Shinies",
                subtype: "Amulet",
                timestamp: new Date(0),
                type: "MysticForge",
            },
            {
                _id: "",
                base_id: "",
                ingredients: [
                    { id: 24276, amount: 250 },
                    { id: 24277, amount: 1 },
                    { id: 20796, amount: 5 },
                    { id: 20799, amount: 5 },
                ],
                location: null,
                prerequisites: [],
                results: [
                    { id: 24277, amount: 6.91 },
                ],
                source: "GW2Shinies",
                subtype: "CraftingMaterial",
                timestamp: new Date(0),
                type: "MysticForge",
            },
            {
                _id: "",
                base_id: "",
                ingredients: [
                    { id: 19976, amount: 100 },
                    { id: 12976, amount: 250 },
                    { id: 19721, amount: 250 },
                    { id: 20852, amount: 1 },
                ],
                location: null,
                prerequisites: [],
                results: [
                    { id: 31058, amount: 1 },
                ],
                source: "GW2Shinies",
                subtype: "Weapon",
                timestamp: new Date(0),
                type: "MysticForge",
            },
            {
                _id: "",
                base_id: "",
                ingredients: [
                    { id: 19976, amount: 17 },
                    { id: 12196, amount: 1 },
                    { id: 19663, amount: 6 },
                    { id: 20799, amount: 9 },
                ],
                location: null,
                prerequisites: [],
                results: [
                    { id: 9731, amount: 1 },
                ],
                source: "GW2Shinies",
                subtype: "Recipe",
                timestamp: new Date(0),
                type: "MysticForge",
            },
        ]);
    });
});

const example1 = [
    {
        average_yield: "1",
        recipe_item_1: "21156",
        recipe_item_1_quantity: "2",
        recipe_item_2: "19700",
        recipe_item_2_quantity: "5",
        recipe_item_3: "19722",
        recipe_item_3_quantity: "5",
        recipe_item_4: "20798",
        recipe_item_4_quantity: "1",
        target_recipe: "21260",
        type: "blueprint",
    },
    {
        average_yield: "1",
        recipe_item_1: "23098",
        recipe_item_1_quantity: "1",
        recipe_item_2: "23097",
        recipe_item_2_quantity: "1",
        recipe_item_3: "23096",
        recipe_item_3_quantity: "1",
        recipe_item_4: "20799",
        recipe_item_4_quantity: "50",
        target_recipe: "23095",
        type: "amulet",
    },
    {
        average_yield: "6.91",
        recipe_item_1: "24276",
        recipe_item_1_quantity: "250",
        recipe_item_2: "24277",
        recipe_item_2_quantity: "1",
        recipe_item_3: "20796",
        recipe_item_3_quantity: "5",
        recipe_item_4: "20799",
        recipe_item_4_quantity: "5",
        target_recipe: "24277",
        type: "promo",
    },
    {
        average_yield: "1",
        recipe_item_1: "19976",
        recipe_item_1_quantity: "100",
        recipe_item_2: "12976",
        recipe_item_2_quantity: "250",
        recipe_item_3: "19721",
        recipe_item_3_quantity: "250",
        recipe_item_4: "20852",
        recipe_item_4_quantity: "1",
        target_recipe: "31058",
        type: "weapon",
    },
    {
        average_yield: "1",
        recipe_item_1: "19976",
        recipe_item_1_quantity: "17",
        recipe_item_2: "12196",
        recipe_item_2_quantity: "1",
        recipe_item_3: "19663",
        recipe_item_3_quantity: "6",
        recipe_item_4: "20799",
        recipe_item_4_quantity: "9",
        target_recipe: "9731",
        type: "recipe",
    },
];
