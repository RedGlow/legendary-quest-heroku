import * as restify from "restify";
import * as recipes from "./recipes";

const load = (server: restify.Server) => {
    recipes.loadRoot(server);
    server.on("API", (req, res, err, cb) => {
        return cb();
    });
};

export default load;
