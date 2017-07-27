var http = require('http'),
    main = require('./main');

var server = http.createServer(function (req, res) {
    var hello = main.hello();
    res.writeHead(hello.status);
    res.end(hello.content);
});
server.listen(process.env.PORT || 8080);