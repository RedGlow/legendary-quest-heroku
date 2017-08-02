(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var React = require("react");
    exports.Hello = function (props) { return React.createElement("h1", null,
        "Hello from ",
        props.compiler,
        " and ",
        props.framework,
        "!"); };
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9oZWxsby50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFBLDZCQUErQjtJQUlsQixRQUFBLEtBQUssR0FBRyxVQUFDLEtBQWtCLElBQUssT0FBQTs7UUFBZ0IsS0FBSyxDQUFDLFFBQVE7O1FBQU8sS0FBSyxDQUFDLFNBQVM7WUFBTyxFQUEzRCxDQUEyRCxDQUFDIiwiZmlsZSI6ImhlbGxvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElIZWxsb1Byb3BzIHsgY29tcGlsZXI6IHN0cmluZzsgZnJhbWV3b3JrOiBzdHJpbmc7IH1cclxuXHJcbmV4cG9ydCBjb25zdCBIZWxsbyA9IChwcm9wczogSUhlbGxvUHJvcHMpID0+IDxoMT5IZWxsbyBmcm9tIHtwcm9wcy5jb21waWxlcn0gYW5kIHtwcm9wcy5mcmFtZXdvcmt9ITwvaDE+O1xyXG4iXX0=
