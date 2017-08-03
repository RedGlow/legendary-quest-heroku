import * as assert from "assert";
import * as Rx from "rxjs/Rx";
import { switchcase } from "../func";
import { setAlternativeFetchJSON } from "../http";
import * as apiunlocks from "./apiunlocks";
import * as data from "./apiunlocks.spec.data.json";
import checkObservable from "./helperspec";

describe("apiunlocks", () => {
    it("return an observable with various blocks of data", () => {
        const d = data as any;
        const obs = apiunlocks.getRecipes(
            (url: string) => {
                return switchcase({
                    "https://api.guildwars2.com/page1": d.page1,
                    "https://api.guildwars2.com/page2": d.page2,
                    "https://api.guildwars2.com/v2/items?page_size=200&page=0": d.page0,
                })((unknownUrl: string) => { throw new Error(`Unknown URL ${unknownUrl}`); })(url);
            });
        return checkObservable(obs, [
            {
                event: "value",
                value: d.page0.content,
            },
            {
                event: "value",
                value: [d.page1.content[1]],
            },
        ]);
    });
});
