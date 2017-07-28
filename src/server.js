var http = require('http')
    , user = require('./user')
    , main = require('./main')
    ;

module.exports = {
    createAndListen: function (port, callback) {
        var server = http.createServer(function (req, res) {
            main.hello(user).then(hello => {
                res.setHeader('Content-Type', hello.contentType);
                res.writeHead(hello.status);
                res.end(hello.content);
            });
        });
        server.listen(port, callback);
        return server;
    }
}