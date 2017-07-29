import * as assert from "assert";
import { getRecipes } from "../remoteservices/gw2shinies";

describe("Remote system", () => {
    it("Can get GW2Shinies recipes", () => {
        // the promise could fail or succeed; the important thing is that it does raise exceptions
        getRecipes();
    });
});
