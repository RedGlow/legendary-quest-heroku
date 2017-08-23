import * as _ from "lodash";
import { IConfiguration, set } from "./configuration";

// a test configuration allows for extra modifiers
export interface ITestConfiguration extends IConfiguration {
    setFetchResponse: (url: string, body: string, options: {
        status?: number;
        statusText?: string;
        headers?: Headers;
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
        headers: Headers;
    }

    const fetchResponses: { [url: string]: IFetchResponse } = {};

    const setFetchResponse = (url: string, body: string, {
        status = 200,
        statusText = "OK",
        headers = new Headers(),
    }: {
            status?: number;
            statusText?: string;
            headers?: Headers;
        }) => {
        fetchResponses[url] = {
            body,
            headers,
            status,
            statusText,
            url,
        };
    };

    const fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response> = (input, init) =>
        typeof input !== "string" ? Promise.reject("RequestInfo is not supported") :
            !!init ? Promise.reject("init is not supported") :
                !fetchResponses[input] ? Promise.resolve(new Response("Not found", {
                    headers: new Headers({
                        "Content-Type": "text/plain",
                    }),
                    status: 404,
                    statusText: "Not found",
                })) : ((r) => Promise.resolve(new Response(r.body, {
                    headers: r.headers,
                    status: r.status,
                    statusText: r.statusText,
                })))(fetchResponses[input]);

    const testConfiguration = {
        fetch,
        getTime,
        setFetchResponse,
        setTime,
        waitTime,
    };

    set(testConfiguration);

    return testConfiguration;
};
