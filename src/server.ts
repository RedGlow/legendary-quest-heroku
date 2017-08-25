import * as restify from "restify";
import loadAPI from "./api/load";
import loadStatic from "./static/load";

export const createAndListen = (port: number, callback?: () => void) => {
    const server = restify.createServer();
    loadAPI(server);
    loadStatic(server);
    server.listen(port, callback);
    return server;
};
