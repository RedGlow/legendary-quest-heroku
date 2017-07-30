import * as assert from "assert";
import * as Rx from "rxjs/Rx";
import { setAlternativeGet } from "../http";
import * as gw2shinies from "./gw2shinies";
import * as data from "./gw2shinies.spec.data.json";
import checkObservable from "./helperspec";

describe("remoteservices/gw2shinies", () => {
    beforeEach(() => {
        setAlternativeGet((url) =>
            url === "https://www.gw2shinies.com/api/json/forge/" ||
                url === "https://www.gw2shinies.com/api/json/forge" ?
                Promise.resolve(JSON.stringify((data as any).gw2shiniesdata)) : Promise.reject(`Unknown url ${url}`));
    });
    afterEach(() => {
        setAlternativeGet(null);
    });
    it("return an observable returning all the data at once", () => {
        // emulate the data
        const observable = gw2shinies.getRecipes();
        return checkObservable(observable, [
            {
                event: "value",
                value: [{
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
                }],
            },
        ]);
    });
});
