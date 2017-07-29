import * as assert from "assert";
import * as main from "./main";

describe("main", () => {
    it("should return a greeting", () => {
        const usermodule = {
            getName: () => Promise.resolve("Me"),
        };
        return main.hello(usermodule).then((hello) => {
            assert.equal(hello.status, 200);
            assert.equal(hello.content, `<!DOCTYPE html>
<html>
    <head>
        <title>Title</title>
    </head>
    <body>
        <p>Hi everybody from Me!</p>
    </body>
</html>`);
        });
    });
});
