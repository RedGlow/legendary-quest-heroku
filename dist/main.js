Object.defineProperty(exports, "__esModule", { value: true });
exports.hello = function (usermodule) { return usermodule.getName().then(function (name) { return ({
    status: 200,
    contentType: 'text/html',
    content: "<!DOCTYPE html><html><head><title>Title</title></head><body><p>Hi everybody from " + name + "!</p></body></html>"
}); }); };
