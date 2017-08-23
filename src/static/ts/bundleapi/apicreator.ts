import { get as conf } from "../configuration";
import { Bucket } from "./bucket";

const createApi = (bucket: Bucket, baseUrl: string, defaultIdQSParameter: string, defaultIdKey: string) => {
    type PromiseCouple = [(result: any) => void];

    /**
     * The call queue is structured like this:
     * - It is an array of calls to be performed. New call requests are enqueued,
     *   and call requests are served from the first one, thus respecting order
     * - Each call is a map, whose keys are the ids to interrogate.
     * - To each id corresponds a list of resolve functions for promises.
     */
    const queue: Array<{
        path: string;
        resolutions: { [id: number]: [PromiseCouple] };
    }> = [];

    const enqueue = (path: string, id: number) => {
        // if we already have this call in queue, we must not create a new entry
        let queueEntry = queue.find((entry) => entry.path === path);
        if (!queueEntry) {
            queueEntry = {
                path,
                resolutions: [],
            };
            queue.push(queueEntry);
            bucket.getToken().then(() => runQueueEntry(path));
        }

        // if we already have this id, we must not create a new list of resolutions
        const resolutions =
            queueEntry.resolutions[id] =
            queueEntry.resolutions[id] || [] as [PromiseCouple];

        const promise = new Promise((resolve, reject) => resolutions.push([resolve, reject]));

        return promise;
    };

    const getId = (obj: any): number => obj[defaultIdKey] as number;

    const produceRejectFromResponse = (resp: Response): Promise<{}> => {
        return resp.text().then((text) => {
            const err = `Error: status ${resp.status}, body: ${text}`;
            return Promise.reject(err);
        });
    };

    const runQueueEntry = (path: string) => {
        const queueEntryIndex = queue.findIndex((entry) => entry.path === path);
        const queueEntry = queue.splice(queueEntryIndex, 1)[0];
        const url = baseUrl +
            path +
            "?" +
            defaultIdQSParameter +
            "=" +
            Object.keys(queueEntry.resolutions).join(",");
        conf()
            .fetch(url)
            .then((resp) => resp.status === 404 ? [] :
                resp.status > 400 ? produceRejectFromResponse(resp) :
                    resp.json())
            .then((json: any[]) => {
                const foundIds = json.map((entry) => {
                    const id = getId(entry);
                    const resolutions = queueEntry.resolutions[id];
                    resolutions.forEach((resolutors) => resolutors[0](entry));
                    return id;
                });
                Object.keys(queueEntry.resolutions).forEach((sid) => {
                    const id = parseInt(sid, 10);
                    if (foundIds.indexOf(id) < 0) {
                        queueEntry.resolutions[id].forEach((resolutions) => resolutions[0](null));
                    }
                });
            })
            .catch((err) => {
                Object.keys(queueEntry.resolutions).forEach((sid) => {
                    const id = parseInt(sid, 10);
                    queueEntry.resolutions[id].forEach((resolutions) => {
                        resolutions[1](err);
                    });
                });
            });
    };

    return enqueue;
};

export default createApi;
