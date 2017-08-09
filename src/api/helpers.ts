import * as _ from "lodash";
import * as restify from "restify";
import { getRecipesForItems } from "../db";
import { APIError } from "./error";

interface IBaseT {
    _id: string;
    base_id: string;
}

export const loadCollectionRoot = <T extends IBaseT>(
    path: string,
    queryparametername: string,
    queryFunction: (...ids: number[]) => Promise<T[]>,
    server: restify.Server) => {
    server.get(path, (req, res, next) => {
        const parameter = req.query[queryparametername];
        if (!parameter) {
            next(new APIError(403, "too-many", "Cannot directly access the root endpoint because " +
                `there are too many items. Try ${path}?${queryparametername}=id1,id2,id3`));
            return;
        }
        const ids = (parameter as string)
            .split(",")
            .map(_.unary(_.partialRight(parseInt, 10)));
        if (!_.every(ids, isFinite)) {
            next(new APIError(400, "wrong-resultitemids", "Cannot parse the list of ids from " +
                `the ${queryparametername} querystring`));
            return;
        }
        queryFunction(...ids).then(
            (items) => {
                res.send(items.map((item) => { delete item._id; delete item.base_id; return item; }));
                next();
            },
            (err) => next(new APIError(500, "internal-error", err)));
    });
};
