import * as restify from "restify";
import * as recipes from "./recipes";

const load = (server: restify.Server) => {
    server.use(restify.plugins.queryParser());
    recipes.loadRoot(server);
};

export default load;
