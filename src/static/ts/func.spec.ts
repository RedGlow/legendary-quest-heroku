import * as assert from "./assert";
import * as func from "./func";

describe("func", () => {
    it("'intObjectKeys' gets the integer keys of an object", () => {
        assert.deepEqual(
            func.intObjectKeys({ 3: "hello", 4: "bye" }).sort((a, b) => a - b),
            [3, 4],
        );
    });

    it("'strictShift' returns the first element of a non-empty array", () => {
        const arr = ["a"];
        const el = func.strictShift(arr);
        assert.equal(el, "a");
        assert.deepEqual(arr, []);
    });

    it("'strictShift' throws an Error if the array is empty", () => {
        const arr: any[] = [];
        assert.throws(() => func.strictShift(arr));
    });
});
