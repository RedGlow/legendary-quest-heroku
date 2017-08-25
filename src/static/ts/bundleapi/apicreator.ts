import * as _ from "lodash";
import { get as conf } from "../configuration";
import { intObjectKeys } from "../func";
import { Bucket } from "./bucket";

type PromiseCouple = [(result: any[]) => void, (err: any) => void];

const createApi = (
    bucket: Bucket,
    baseUrl: string,
    defaultIdQSParameter: string,
    defaultIdKey: string,
    {
        nobundlepaths = [] as string[],
        idQSParameters = {} as { [path: string]: string },
        maxIds = 200,
        getObjectId = null as ((obj: any, idList: number[]) => number) | null,
    } = {}) => {
    /**
     * The call queue is structured like this:
     * - It is a map, whose keys are the paths of the calls yet to perform.
     * - Each call is a map, whose keys are the ids to interrogate.
     * - To each id corresponds a list of resolve functions for promises.
     */
    const queue: {
        [path: string]: { [id: number]: [PromiseCouple] };
    } = {};

    /**
     * The queued structure is created just like queue, but it is used to
     * keep track of calls currently running. This is useful to add extra
     * promise resolutions asked while an API call was already running.
     * Entries from queue[id] are moved to queued[id] while running and
     * deleted afterwards.
     */
    const queued: {
        [path: string]: { [id: number]: [PromiseCouple] };
    } = {};

    const enqueue = (path: string, id: number): Promise<any[]> => {
        // some calls do not allow bundling of requests: just do it immediately
        if (_.includes(nobundlepaths, path)) {
            return bucket.getToken().then(() => runRequest(path, [id]));
        }

        // if we have this call for this id already enqueued, use it
        if (_.has(queued, `[${path}][${id}]`)) {
            return new Promise((resolve, reject) => queued[path][id].push([resolve, reject]));
        }

        // if we don't have this call in queue, we must create a new entry and run it
        if (!queue[path]) {
            bucket.getToken().then(() => runQueueEntry(path));
        }
        const queueEntry = queue[path] = queue[path] || {};

        // if we already have this id, we must not create a new list of resolutions
        const resolutions =
            queueEntry[id] =
            queueEntry[id] || [] as [PromiseCouple];

        const promise = new Promise<any[]>((resolve, reject) => resolutions.push([resolve, reject]));

        return promise;
    };

    const produceUrl = (path: string, ids: number[]) =>
        baseUrl +
        path +
        "?" +
        (idQSParameters[path] || defaultIdQSParameter) +
        "=" +
        ids.join(",");

    const runRequest = (path: string, ids: number[]) =>
        conf()
            .fetch(produceUrl(path, ids))
            .then((resp) => resp.status === 404 ? [] :
                resp.status > 400 ? produceRejectFromResponse(resp) :
                    resp.json());

    const getId = (path: string, searchedIds: number[], obj: any): number =>
        getObjectId === null ? obj[defaultIdKey] as number : getObjectId(obj, searchedIds);

    const produceRejectFromResponse = (resp: Response): Promise<{}> =>
        resp
            .text()
            .then((text) => Promise.reject(`Error: status ${resp.status}, body: ${text}`));

    const runQueueEntry = (path: string) => {
        const queueEntry = queue[path];
        const remainingIds = intObjectKeys(queueEntry).sort((a, b) => a - b);
        const processedIds = remainingIds.splice(0, maxIds);
        if (remainingIds.length === 0) {
            delete queue[path];
        } else {
            queue[path] = _.pickBy(queueEntry, (value, key) => {
                return _.includes(remainingIds, parseInt(key, 10));
            });
            bucket.getToken().then(() => runQueueEntry(path));
        }
        queued[path] = queueEntry;
        runRequest(path, processedIds)
            .then((json: any[]) => {
                const entriesById = _.groupBy(json, _.partial(getId, path, processedIds));
                const foundIds = intObjectKeys(entriesById);
                foundIds.forEach((id) => {
                    const resolutions = queueEntry[id];
                    resolutions.forEach((resolutors) => resolutors[0](entriesById[id]));
                });
                processedIds
                    .filter((id) => foundIds.indexOf(id) < 0)
                    .forEach((id) => queueEntry[id].forEach((resolutions) => resolutions[0]([])));
                delete queued[path];
            })
            .catch((err) =>
                processedIds.forEach((id) =>
                    queueEntry[id].forEach(
                        (resolutions) => resolutions[1](err))));
    };

    return enqueue;
};

export default createApi;
