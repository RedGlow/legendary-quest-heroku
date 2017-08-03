(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "assert", "./data"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var assert = require("assert");
    var data_1 = require("./data");
    describe("data", function () {
        it("Container correct data", function () {
            assert.equal(data_1.default.compiler, "Typescript");
            assert.equal(data_1.default.framework, "React");
        });
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90ZXN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQUEsK0JBQWlDO0lBRWpDLCtCQUEwQjtJQUUxQixRQUFRLENBQUMsTUFBTSxFQUFFO1FBQ2IsRUFBRSxDQUFDLHdCQUF3QixFQUFFO1lBQ3pCLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBSSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJ0ZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFzc2VydCBmcm9tIFwiYXNzZXJ0XCI7XHJcbmltcG9ydCAqIGFzIG1vY2hhIGZyb20gXCJtb2NoYVwiO1xyXG5pbXBvcnQgZGF0YSBmcm9tIFwiLi9kYXRhXCI7XHJcblxyXG5kZXNjcmliZShcImRhdGFcIiwgKCkgPT4ge1xyXG4gICAgaXQoXCJDb250YWluZXIgY29ycmVjdCBkYXRhXCIsICgpID0+IHtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoZGF0YS5jb21waWxlciwgXCJUeXBlc2NyaXB0XCIpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChkYXRhLmZyYW1ld29yaywgXCJSZWFjdFwiKTtcclxuICAgIH0pO1xyXG59KTtcclxuIl19
