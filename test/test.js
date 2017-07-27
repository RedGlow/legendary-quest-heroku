var assert = require('assert'),
    main = require('../main')
    ;

describe('main', function () {
    it('should return a greeting', function () {
        var hello = main.hello();
        assert.equal(hello.status, 200);
        assert.equal(hello.content, '<!DOCTYPE html><html><head><title>Title</title></head><body><p>Hi everybody!</p></body></html>');
    });
});