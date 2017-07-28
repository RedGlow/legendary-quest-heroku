module.exports = {
    hello: function () {
        return {
            status: 200,
            contentType: 'text/html',
            content: '<!DOCTYPE html><html><head><title>Title</title></head><body><p>Hi everybody!</p></body></html>'
        };
    }
};