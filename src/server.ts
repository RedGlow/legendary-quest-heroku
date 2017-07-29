import * as http from "http";
import * as main from "./main";
import * as user from "./user";

export const createAndListen = (port: number, callback: () => void = null) => {
    const server = http.createServer((req, res) => {
        main.hello(user).then((hello) => {
            res.setHeader("Content-Type", hello.contentType);
            res.writeHead(hello.status);
            res.end(hello.content);
        }, (err) => {
            res.setHeader("Content-Type", "text/plain");
            res.writeHead(500);
            res.end(`Error: ${err}`);
        });
    });
    server.listen(port, callback);
    return server;
};
