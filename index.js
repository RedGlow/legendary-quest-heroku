var server = require('./server')
    ;

server.createAndListen(process.env.PORT || 8080);