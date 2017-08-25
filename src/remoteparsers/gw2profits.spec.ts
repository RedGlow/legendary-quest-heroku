import * as assert from "assert";
import { IRecipe, IRecipeItem, RecipeType } from "../recipe";
import { transformRecipe } from "./gw2profits";
import * as data from "./gw2profits.spec.data.json";

describe("remoteparsers/gw2profits", () => {
    it("can parse recipes", () => {
        const result = ((data as any).data).map(transformRecipe);
        assert.deepEqual(result, (data as any).expected
            .map((e: IRecipe) => { e.timestamp = new Date(0); return e; }));
    });
});
