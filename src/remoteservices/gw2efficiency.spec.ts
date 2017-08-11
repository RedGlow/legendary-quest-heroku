import * as assert from "assert";
import * as Rx from "rxjs/Rx";
import * as gw2efficiency from "./gw2efficiency";
import * as data from "./gw2efficiency.spec.data.json";
import checkObservable from "./helperspec";

describe("remoteservices/gw2efficiency", () => {
    const fetchFunction = (url: string) =>
        url === "https://raw.githubusercontent.com/gw2efficiency" +
            "/recipe-calculation/master/src/static/vendorItems.js" ?
            Promise.resolve((data as any).gw2efficiencydata as string) :
            Promise.reject(`Unknown url ${url}`);
    it("return an observable returning all the data at once", () => {
        const observable = gw2efficiency.getRecipes(fetchFunction);
        return checkObservable(observable, [
            {
                event: "value",
                value: [{
                    cost: 77,
                    id: 12337,
                    npcs: [
                        { name: "Disa", position: "Snowslide Ravine, Dredgehaunt Cliffs [N]" },
                        { name: "Lieutenant Pickins", position: "Greystone Rise, Harathi Hinterlands [W]" },
                    ],
                    quantity: 25,
                    type: "karma",
                }],
            },
        ]);
    });
});
