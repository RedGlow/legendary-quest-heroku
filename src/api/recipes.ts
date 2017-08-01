import * as restify from "restify";
import { APIError } from "./error";

export const loadRoot = (server: restify.Server) => {
    server.get("/api/recipes", (req, res, next) => {
        next(new APIError(403, "too-many", "Cannot directly access the root endpoint because " +
            "there are too many items. Try /recipes?resultitemids=itemids"));
    });
};
