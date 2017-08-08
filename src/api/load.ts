import * as restify from "restify";
import { loadRoot as loadRecipesRoot } from "./recipes";
import { loadRoot as loadRecipeUnlocksRoot } from "./recipeunlocks";

const load = (server: restify.Server) => {
    server.use(restify.plugins.queryParser());
    loadRecipesRoot(server);
    loadRecipeUnlocksRoot(server);
};

export default load;
