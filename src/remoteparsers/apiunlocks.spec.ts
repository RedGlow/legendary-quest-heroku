import * as assert from "assert";
import { IRecipeUnlock } from "../recipeunlock";
import { transformRecipeUnlock } from "./apiunlocks";
import * as data from "./apiunlocks.spec.data.json";

describe("remoteparsers/apiunlocks", () => {
    it("can parse recipes", () => {
        const result: IRecipeUnlock[] = (data as any).map(transformRecipeUnlock);
        assert.deepEqual(result, [
            {
                _id: "",
                recipe_id: 100,
                recipe_sheet_id: 1,
                timestamp: new Date(0),
            },
            {
                _id: "",
                recipe_id: 200,
                recipe_sheet_id: 2,
                timestamp: new Date(0),
            },
        ]);
    });
});
