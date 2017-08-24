import getApi, { IApi } from "./api";
import * as assert from "./assert";
import { ITestConfiguration, setTestConfiguration } from "./testconf";

describe("api", () => {
    let c: ITestConfiguration;
    let api: IApi;

    beforeEach(() => {
        c = setTestConfiguration();
        api = getApi();
    });

    it("Can get a recipe from the official API", async () => {
        c.setFetchResponse("https://api.guildwars2.com/v2/recipes/search?output=46742",
            JSON.stringify([
                7319,
            ]), {});
        c.setFetchResponse("https://api.guildwars2.com/v2/recipes?ids=7319",
            JSON.stringify([recipe7319]), {});
        c.setTime(200);
        const results = await api.getRecipesFromOutput(46742);
        assert.equal(results.length, 1);
        const result = results[0];
        assert.deepEqual(result, {
            ingredients: [{
                amount: 50,
                id: 19684,
            }, {
                amount: 1,
                id: 19721,
            }, {
                amount: 10,
                id: 46747,
            }],
            prerequisites: [{
                disciplines: [
                    "Leatherworker",
                    "Armorsmith",
                    "Tailor",
                    "Artificer",
                    "Weaponsmith",
                    "Huntsman",
                ],
                rating: 450,
            }],
            results: [{
                amount: 1,
                id: 46742,
            }],
            type: "Crafting",
        });
    });
});

/* tslint:disable:object-literal-key-quotes object-literal-sort-keys trailing-comma */
const recipe7319 = {
    "type": "RefinementEctoplasm",
    "output_item_id": 46742,
    "output_item_count": 1,
    "min_rating": 450,
    "time_to_craft_ms": 5000,
    "disciplines": [
        "Leatherworker",
        "Armorsmith",
        "Tailor",
        "Artificer",
        "Weaponsmith",
        "Huntsman"
    ],
    "flags": [
        "AutoLearned"
    ],
    "ingredients": [
        {
            "item_id": 19684,
            "count": 50
        },
        {
            "item_id": 19721,
            "count": 1
        },
        {
            "item_id": 46747,
            "count": 10
        }
    ],
    "id": 7319,
    "chat_link": "[&CZccAAA=]"
};
/* tslint:enable:object-literal-key-quotes object-literal-sort-keys trailing-comma */
