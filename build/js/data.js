(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var data = {
        compiler: "Typescript",
        framework: "React",
    };
    exports.default = data;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBQSxJQUFNLElBQUksR0FBRztRQUNULFFBQVEsRUFBRSxZQUFZO1FBQ3RCLFNBQVMsRUFBRSxPQUFPO0tBQ3JCLENBQUM7SUFFRixrQkFBZSxJQUFJLENBQUMiLCJmaWxlIjoiZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGRhdGEgPSB7XHJcbiAgICBjb21waWxlcjogXCJUeXBlc2NyaXB0XCIsXHJcbiAgICBmcmFtZXdvcms6IFwiUmVhY3RcIixcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRhdGE7XHJcbiJdfQ==
