import * as restify from "restify";
import load from "./api/load";
import * as main from "./main";
import * as user from "./user";

export const createAndListen = (port: number, callback: () => void = null) => {
    const server = restify.createServer();
    load(server);
    server.get("/", (req, res, next) => {
        main.hello(user).then((hello) => {
            res.setHeader("Content-Type", hello.contentType);
            res.status(hello.status);
            res.end(hello.content);
        }, (err) => {
            res.setHeader("Content-Type", "text/plain");
            res.status(500);
            res.end(`Error: ${err}`);
        });
    });
    server.listen(port, callback);
    return server;
};
