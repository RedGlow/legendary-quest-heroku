import * as assert from "assert";
import * as Rx from "rxjs/Rx";
import { setAlternativeGet } from "../http";
import * as gw2profits from "./gw2profits";
import * as data from "./gw2profits.spec.data.json";
import checkObservable from "./helperspec";

describe("remoteservices/gw2profits", () => {
    beforeEach(() => {
        setAlternativeGet((url) =>
            url === "http://gw2profits.com/json/v2/forge/" ||
                url === "http://gw2profits.com/json/v2/forge" ?
                Promise.resolve(JSON.stringify((data as any).data)) : Promise.reject(`Unknown url ${url}`));
    });
    afterEach(() => {
        setAlternativeGet(null);
    });
    it("return an observable returning all the data at once", () => {
        // emulate the data
        const observable = gw2profits.getRecipes();
        return checkObservable(observable, [
            {
                event: "value",
                value: [
                    {
                        disciplines: [
                            "Mystic Forge",
                        ],
                        ingredients: [
                            {
                                count: 250,
                                item_id: 19697,
                            },
                            {
                                count: 1,
                                item_id: 19699,
                            },
                            {
                                count: 5,
                                item_id: 24273,
                            },
                            {
                                count: 1,
                                item_id: 20796,
                            },
                        ],
                        name: "Iron Ore",
                        output_item_count: 88,
                        output_item_id: 19699,
                        type: "CraftingMaterial",
                    },
                ],
            },
        ]);
    });
});
