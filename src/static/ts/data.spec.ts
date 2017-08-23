import "mocha";
import * as assert from "./assert";
import data from "./data";

describe("data", () => {
    it("Container correct data", () => {
        assert.equal(data.compiler, "Typescript");
        assert.equal(data.framework, "React");
    });
});
