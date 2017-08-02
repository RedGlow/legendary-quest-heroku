import * as restify from "restify";

const load = (server: restify.Server) => {
    server.get(/.*/, restify.plugins.serveStatic({
        default: "index.html",
        directory: "./dist/static/",
    }));
    server.use(restify.plugins.queryParser());
};

export default load;
