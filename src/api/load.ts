import * as restify from "restify";
import * as recipes from "./recipes";

const load = (server: restify.Server) => {
    server.use(restify.plugins.queryParser());
    recipes.loadRoot(server);
    server.on("restifyError", (req, res, err, cb) => {
        /* tslint:disable:no-console */
        console.log("in error");
        /* tslint:enable:no-console */
        return cb();
    });
};

export default load;
