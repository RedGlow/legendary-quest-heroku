Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var main = require("../main");
describe('main', function () {
    it('should return a greeting', function () {
        var usermodule = {
            getName: function () { return Promise.resolve('Me'); }
        };
        return main.hello(usermodule).then(function (hello) {
            assert.equal(hello.status, 200);
            assert.equal(hello.content, '<!DOCTYPE html><html><head><title>Title</title></head><body><p>Hi everybody from Me!</p></body></html>');
        });
    });
});
