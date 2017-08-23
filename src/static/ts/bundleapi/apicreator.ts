import { get as conf } from "../configuration";
import { intObjectKeys } from "../func";
import { Bucket } from "./bucket";

type PromiseCouple = [(result: any) => void];

const createApi = (bucket: Bucket, baseUrl: string, defaultIdQSParameter: string, defaultIdKey: string) => {
    /**
     * The call queue is structured like this:
     * - It isa map, whose keys are the paths of the calls yet to perform.
     * - Each call is a map, whose keys are the ids to interrogate.
     * - To each id corresponds a list of resolve functions for promises.
     */
    const queue: {
        [path: string]: { [id: number]: [PromiseCouple] };
    } = {};

    const enqueue = (path: string, id: number) => {
        // if we don't have this call in queue, we must create a new entry and run it
        if (!queue[path]) {
            bucket.getToken().then(() => runQueueEntry(path));
        }
        const queueEntry = queue[path] = queue[path] || {};

        // if we already have this id, we must not create a new list of resolutions
        const resolutions =
            queueEntry[id] =
            queueEntry[id] || [] as [PromiseCouple];

        const promise = new Promise((resolve, reject) => resolutions.push([resolve, reject]));

        return promise;
    };

    const getId = (obj: any): number => obj[defaultIdKey] as number;

    const produceRejectFromResponse = (resp: Response): Promise<{}> =>
        resp
            .text()
            .then((text) => Promise.reject(`Error: status ${resp.status}, body: ${text}`));

    const runQueueEntry = (path: string) => {
        const queueEntry = queue[path];
        delete queue[path];
        const url = baseUrl +
            path +
            "?" +
            defaultIdQSParameter +
            "=" +
            Object.keys(queueEntry).join(",");
        conf()
            .fetch(url)
            .then((resp) => resp.status === 404 ? [] :
                resp.status > 400 ? produceRejectFromResponse(resp) :
                    resp.json())
            .then((json: any[]) => {
                const foundIds = json.map((entry) => {
                    const id = getId(entry);
                    const resolutions = queueEntry[id];
                    resolutions.forEach((resolutors) => resolutors[0](entry));
                    return id;
                });
                intObjectKeys(queueEntry)
                    .filter((id) => foundIds.indexOf(id) < 0)
                    .forEach((id) => queueEntry[id].forEach((resolutions) => resolutions[0](null)));
            })
            .catch((err) =>
                intObjectKeys(queueEntry).forEach((id) =>
                    queueEntry[id].forEach(
                        (resolutions) => resolutions[1](err))));
    };

    return enqueue;
};

export default createApi;
