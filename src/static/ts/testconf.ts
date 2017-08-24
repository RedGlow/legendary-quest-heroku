import * as _ from "lodash";
import * as nodeFetch from "node-fetch";
import { IConfiguration, set } from "./configuration";

// a test configuration allows for extra modifiers
export interface ITestConfiguration extends IConfiguration {
    pauseFetchResolution: () => void;
    resumeFetchResolution: () => void;
    setFetchResponse: (url: string, body: string, options: {
        status?: number;
        statusText?: string;
        headers?: nodeFetch.Headers;
    }) => void;
    setTime: (time: number) => Promise<void>;
}

export const setTestConfiguration: () => ITestConfiguration = () => {
    // the current (simulated) time
    let time: number = 0;

    // the waiting handlers
    interface IWaiting {
        resolver: () => void;
        time: number;
    }

    let waiting: IWaiting[] = [];

    // getting time is as simple as returning the current simulated time
    const getTime: () => number = () => time;

    // waiting time just amounts to pushing an IWaiting in the queue
    const waitTime: (delay: number) => Promise<void> = (delay) =>
        delay <= 0 ?
            Promise.resolve() :
            new Promise((resolver) => {
                waiting.push({
                    resolver,
                    time: time + delay,
                });
            });

    // setting time is what can unlock elements from the IWaiting queue
    const setTime: (time: number) => Promise<void> = (t) => {
        time = t;
        const groups = _.groupBy(waiting, (w) => w.time <= t);
        waiting = groups.false || [];
        (groups.true || []).forEach((w) => w.resolver());
        return new Promise((resolve) => {
            setTimeout(resolve, 20);
        });
    };

    interface IFetchResponse {
        url: string;
        body: string;
        status: number;
        statusText: string;
        headers: nodeFetch.Headers;
    }

    const fetchResponses: { [url: string]: IFetchResponse } = {};

    let fetchResponsesPaused = false;

    const pausedFetchResolvers = [] as [() => void];

    const setFetchResponse = (url: string, body: string, {
        status = 200,
        statusText = "OK",
        headers = new nodeFetch.Headers(),
    }: {
            status?: number;
            statusText?: string;
            headers?: nodeFetch.Headers;
        }) => {
        fetchResponses[url] = {
            body,
            headers,
            status,
            statusText,
            url,
        };
    };

    const pauseFetchResolution = () => {
        fetchResponsesPaused = true;
    };

    const resumeFetchResolution = () => {
        fetchResponsesPaused = false;
        flushResponses();
    };

    const flushResponses = () => {
        if (!fetchResponsesPaused) {
            pausedFetchResolvers.forEach((r) => r());
            pausedFetchResolvers.length = 0;
        }
    };

    const getFetchPromise = (r: Response): Promise<Response> => {
        const promise = new Promise<Response>((resolve) => pausedFetchResolvers.push(() => resolve(r)));
        flushResponses();
        return promise;
    };

    const fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response> = (input, init) =>
        typeof input !== "string" ? Promise.reject("RequestInfo is not supported") :
            !!init ? Promise.reject("init is not supported") :
                !fetchResponses[input] ? (() => {
                    const headers = new nodeFetch.Headers();
                    headers.append("Content-Type", "text/plain");
                    return getFetchPromise(new nodeFetch.Response("Not found", {
                        headers,
                        status: 404,
                        statusText: "Not found",
                    }) as any as Response);
                })() : ((r) => getFetchPromise(new nodeFetch.Response(r.body, {
                    headers: r.headers,
                    status: r.status,
                    statusText: r.statusText,
                }) as any as Response))(fetchResponses[input]);

    const testConfiguration = {
        fetch,
        getTime,
        pauseFetchResolution,
        resumeFetchResolution,
        setFetchResponse,
        setTime,
        waitTime,
    };

    set(testConfiguration);

    return testConfiguration;
};
