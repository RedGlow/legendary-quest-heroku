import * as restify from "restify";
import loadAPI from "./api/load";
import loadStatic from "./static/load";
import * as user from "./user";

export const createAndListen = (port: number, callback: () => void = null) => {
    const server = restify.createServer();
    loadAPI(server);
    loadStatic(server);
    server.listen(port, callback);
    return server;
};
