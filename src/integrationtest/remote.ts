import * as assert from "assert";
import { getRecipes as getGW2EfficiencyRecipes } from "../remoteservices/gw2efficiency";
import { getRecipes as getGW2ShiniesRecipes } from "../remoteservices/gw2shinies";

describe("Remote system", () => {
    it("Can get GW2Shinies recipes", () => {
        // the promise could fail or succeed; the important thing is that it does raise exceptions
        getGW2ShiniesRecipes();
    });
    it("Can get GW2Efficiency recipes", () => {
        // the promise could fail or succeed; the important thing is that it does raise exceptions
        getGW2EfficiencyRecipes();
    });
});
