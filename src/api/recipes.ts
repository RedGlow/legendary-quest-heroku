import * as _ from "lodash";
import * as restify from "restify";
import { getRecipesForItems } from "../db";
import { APIError } from "./error";

export const loadRoot = (server: restify.Server) => {
    server.get("/api/recipes", (req, res, next) => {
        if (!req.query.resultitemids) {
            next(new APIError(403, "too-many", "Cannot directly access the root endpoint because " +
                "there are too many items. Try /recipes?resultitemids=itemids"));
            return;
        }
        const ids = (req.query.resultitemids as string)
            .split(",")
            .map(_.unary(_.partialRight(parseInt, 10)));
        if (!_.every(ids, isFinite)) {
            next(new APIError(400, "wrong-resultitemids", "Cannot parse the list of ids from " +
                "the resultitemids querystring"));
            return;
        }
        getRecipesForItems(...ids).then(
            (recipes) => { res.send(recipes); next(); },
            (err) => next(new APIError(500, "internal-error", err)));
    });
};
