Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var user = require("./user");
var main = require("./main");
exports.createAndListen = function (port, callback) {
    var server = http.createServer(function (req, res) {
        main.hello(user).then(function (hello) {
            res.setHeader('Content-Type', hello.contentType);
            res.writeHead(hello.status);
            res.end(hello.content);
        }, function (err) {
            res.setHeader('Content-Type', 'text/plain');
            res.writeHead(500);
            res.end("Error: " + err);
        });
    });
    server.listen(port, callback);
    return server;
};
