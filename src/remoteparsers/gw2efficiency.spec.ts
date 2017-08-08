import * as assert from "assert";
import { IRecipe, IRecipeItem, RecipeType } from "../recipe";
import { transformRecipe } from "./gw2efficiency";
import * as data from "./gw2efficiency.spec.data.json";

describe("remoteparsers/gw2efficiency", () => {
    it("can parse recipes", () => {
        const result = ((data as any).data).map(transformRecipe);
        assert.deepEqual(result, [
            {
                _id: null,
                base_id: null,
                ingredients: [
                    { name: "Coin", amount: 80 },
                ],
                location: null,
                prerequisites: [],
                results: [
                    { id: 12136, amount: 10 },
                ],
                source: "GW2Efficiency",
                subtype: null,
                timestamp: null,
                type: "Vendor",
            },
            {
                _id: null,
                base_id: null,
                ingredients: [
                    { name: "Karma", amount: 35 },
                ],
                location: null,
                prerequisites: [],
                results: [
                    { id: 12137, amount: 25 },
                ],
                source: "GW2Efficiency",
                subtype: null,
                timestamp: null,
                type: "Vendor",
            },
            {
                _id: null,
                base_id: null,
                ingredients: [
                    { name: "Ascalonian Tear", amount: 500 },
                ],
                location: null,
                prerequisites: [],
                results: [
                    { id: 19664, amount: 1 },
                ],
                source: "GW2Efficiency",
                subtype: null,
                timestamp: null,
                type: "Vendor",
            },
            {
                _id: null,
                base_id: null,
                ingredients: [
                    { name: "Seal of Beetletun", amount: 500 },
                ],
                location: null,
                prerequisites: [],
                results: [
                    { id: 19665, amount: 1 },
                ],
                source: "GW2Efficiency",
                subtype: null,
                timestamp: null,
                type: "Vendor",
            },
            {
                _id: null,
                base_id: null,
                ingredients: [
                    { name: "Manifesto of the Moletariate", amount: 500 },
                ],
                location: null,
                prerequisites: [],
                results: [
                    { id: 19666, amount: 1 },
                ],
                source: "GW2Efficiency",
                subtype: null,
                timestamp: null,
                type: "Vendor",
            },
            {
                _id: null,
                base_id: null,
                ingredients: [
                    { name: "Deadly Bloom", amount: 500 },
                ],
                location: null,
                prerequisites: [],
                results: [
                    { id: 19667, amount: 1 },
                ],
                source: "GW2Efficiency",
                subtype: null,
                timestamp: null,
                type: "Vendor",
            },
            {
                _id: null,
                base_id: null,
                ingredients: [
                    { name: "Flame Legion Charr Carving", amount: 500 },
                ],
                location: null,
                prerequisites: [],
                results: [
                    { id: 19668, amount: 1 },
                ],
                source: "GW2Efficiency",
                subtype: null,
                timestamp: null,
                type: "Vendor",
            },
            {
                _id: null,
                base_id: null,
                ingredients: [
                    { name: "Shard of Zhaitan", amount: 500 },
                ],
                location: null,
                prerequisites: [],
                results: [
                    { id: 19669, amount: 1 },
                ],
                source: "GW2Efficiency",
                subtype: null,
                timestamp: null,
                type: "Vendor",
            },
            {
                _id: null,
                base_id: null,
                ingredients: [
                    { name: "Symbol of Koda", amount: 500 },
                ],
                location: null,
                prerequisites: [],
                results: [
                    { id: 19670, amount: 1 },
                ],
                source: "GW2Efficiency",
                subtype: null,
                timestamp: null,
                type: "Vendor",
            },
            {
                _id: null,
                base_id: null,
                ingredients: [
                    { name: "Knowledge Crystal", amount: 500 },
                ],
                location: null,
                prerequisites: [],
                results: [
                    { id: 19671, amount: 1 },
                ],
                source: "GW2Efficiency",
                subtype: null,
                timestamp: null,
                type: "Vendor",
            },
            {
                _id: null,
                base_id: null,
                ingredients: [
                    { name: "Spirit Shard", amount: 1 },
                ],
                location: null,
                prerequisites: [],
                results: [
                    { id: 20796, amount: 10 },
                ],
                source: "GW2Efficiency",
                subtype: null,
                timestamp: null,
                type: "Vendor",
            },
            {
                _id: null,
                base_id: null,
                ingredients: [
                    { name: "Fractal Relic", amount: 1350 },
                ],
                location: null,
                prerequisites: [],
                results: [
                    { id: 37050, amount: 1 },
                ],
                source: "GW2Efficiency",
                subtype: null,
                timestamp: null,
                type: "Vendor",
            },
            {
                _id: null,
                base_id: null,
                ingredients: [
                    { name: "WvW Tournament Claim Ticket", amount: 200 },
                ],
                location: null,
                prerequisites: [],
                results: [
                    { id: 43244, amount: 1 },
                ],
                source: "GW2Efficiency",
                subtype: null,
                timestamp: null,
                type: "Vendor",
            },
            {
                _id: null,
                base_id: null,
                ingredients: [
                    { name: "Geode", amount: 9 },
                ],
                location: null,
                prerequisites: [],
                results: [
                    { id: 66902, amount: 1 },
                ],
                source: "GW2Efficiency",
                subtype: null,
                timestamp: null,
                type: "Vendor",
            },
            {
                _id: null,
                base_id: null,
                ingredients: [
                    { name: "Pristine Fractal Relic", amount: 5 },
                ],
                location: null,
                prerequisites: [],
                results: [
                    { id: 67007, amount: 1 },
                ],
                source: "GW2Efficiency",
                subtype: null,
                timestamp: null,
                type: "Vendor",
            },
            {
                _id: null,
                base_id: null,
                ingredients: [
                    { name: "Guild Commendation", amount: 1 },
                ],
                location: null,
                prerequisites: [],
                results: [
                    { id: 72169, amount: 1 },
                ],
                source: "GW2Efficiency",
                subtype: null,
                timestamp: null,
                type: "Vendor",
            },
        ]);
    });
});
