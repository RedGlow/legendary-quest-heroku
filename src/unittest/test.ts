import * as assert from 'assert';
import * as main from '../main';

describe('main', function () {
    it('should return a greeting', function () {
        const usermodule = {
            getName: () => Promise.resolve('Me')
        };
        return main.hello(usermodule).then(hello => {
            assert.equal(hello.status, 200);
            assert.equal(hello.content, '<!DOCTYPE html><html><head><title>Title</title></head><body><p>Hi everybody from Me!</p></body></html>');
        });
    });
});