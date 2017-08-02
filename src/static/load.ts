import * as restify from "restify";

const load = (server: restify.Server) => {
    server.get(/.*/, restify.plugins.serveStatic({
        default: "index.min.html",
        directory: "./dist/static/client/",
    }));
    server.use(restify.plugins.queryParser());
};

export default load;
