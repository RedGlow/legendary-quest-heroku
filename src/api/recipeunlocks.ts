import * as _ from "lodash";
import * as restify from "restify";
import { getRecipeUnlocksForIds } from "../db";
import { loadCollectionRoot } from "./helpers";

export const loadRoot: (server: restify.Server) => void = _.partial(
    loadCollectionRoot,
    "/api/recipeunlocks",
    "recipeids",
    getRecipeUnlocksForIds);
