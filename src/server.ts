import * as http from 'http';
import * as user from './user';
import * as main from './main';

export const createAndListen = (port: number, callback: Function) => {
    var server = http.createServer(function (req, res) {
        main.hello(user).then(hello => {
            res.setHeader('Content-Type', hello.contentType);
            res.writeHead(hello.status);
            res.end(hello.content);
        }, err => {
            res.setHeader('Content-Type', 'text/plain');
            res.writeHead(500);
            res.end(`Error: ${err}`);
        });
    });
    server.listen(port, callback);
    return server;
};