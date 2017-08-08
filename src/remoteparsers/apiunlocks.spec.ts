import * as assert from "assert";
import { IRecipeUnlock } from "../recipeunlock";
import { transformRecipeUnlock } from "./apiunlocks";
import * as data from "./apiunlocks.spec.data.json";

describe("remoteparsers/apiunlocks", () => {
    it("can parse recipes", () => {
        const result: IRecipeUnlock[] = (data as any).map(transformRecipeUnlock);
        assert.deepEqual(result, [
            {
                _id: null,
                recipe_id: 100,
                recipe_sheet_id: 1,
                timestamp: null,
            },
            {
                _id: null,
                recipe_id: 200,
                recipe_sheet_id: 2,
                timestamp: null,
            },
        ]);
    });
});
