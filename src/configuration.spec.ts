import * as assert from "assert";
import get from "./configuration";

describe("configuration", () => {
    it("has some default value", () => {
        const conf = get();
        const value = conf.remoteServices.gw2EfficiencyUrl;
        assert(!!value);
    });
});
