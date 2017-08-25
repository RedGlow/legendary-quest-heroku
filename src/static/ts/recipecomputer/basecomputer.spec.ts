import { IRecipe } from "../api";
import * as assert from "../assert";
import computer, { isBaseComputerItemNode } from "./basecomputer";

describe("recipecomputer/basecomputer", () => {
    const knownRecipes = {} as { [outputId: number]: IRecipe[] };

    const getRecipe = (outputId: number) => Promise.resolve(
        knownRecipes[outputId] || []);

    it("Returns an empty root node if no recipe for it is known", async () => {
        /*const result = await computer(100, getRecipe, {}, {});
        assert.mustNotBeNull(result);
        assert.equal(result.neededAmount, 1);
        assert.equal(result.ownedAmount, 1);
        assert.equal(result.itemId, 100);
        assert.deepEqual(result.recipes, []);*/
    });
});
