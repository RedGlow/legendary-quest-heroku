import * as assert from "assert";
import { extract, switchcase, switchcaseC } from "./func";

describe("func", () => {
    it("can switchcaseC without cases", () => {
        const s = switchcaseC({});
        assert.equal(s(33)("hello"), 33);
        assert.equal(s(44)("hello"), 44);
        assert.equal(s(33)("else"), 33);
        assert.equal(s(44)("else"), 44);
    });
    it("can switchcaseC with a single case", () => {
        const s = switchcaseC({ hello: 33 })(44);
        assert.equal(s("hello"), 33);
        assert.equal(s("helloooo"), 44);
    });
    it("can switchcaseC with multiple cases", () => {
        const s = switchcaseC({ hello: 33, world: 34, how: 35, are: 36, you: 37, doing: 38 })(44);
        assert.equal(s("hello"), 33);
        assert.equal(s("world"), 34);
        assert.equal(s("doing"), 38);
        assert.equal(s("helloooo"), 44);
    });
    it("can use numbers as keys in switchcaseC", () => {
        const s = switchcaseC({ 45: 33 })(44);
        assert.equal(s(45), 33);
        assert.equal(s(45555), 44);
    });
    it("can use functions for complex computations", () => {
        let calls = 0;
        const s = switchcase({
            hello: () => { calls++; return 33; },
            world: () => { calls++; return 34; },
        })(100);
        assert.equal(calls, 0);
        assert.equal(s("doing"), 100);
        assert.equal(calls, 0);
        assert.equal(s("hello"), 33);
        assert.equal(calls, 1);
    });
    it("can check an undefined value", () => {
        assert.deepEqual(extract(33), 33);
        assert.throws(() => extract(undefined));
    });
});
