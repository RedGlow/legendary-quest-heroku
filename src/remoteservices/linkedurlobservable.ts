import fetch, { Request, Response } from "node-fetch";
import * as parselinkheader from "parse-link-header";
import * as Rx from "rxjs/Rx";
import * as urlmodule from "url";

export type FetchFunction<T> = (url: string) => Promise<{ content: T, linkHeader: string }>;

async function fetcher<T>(url: string, obs: Rx.Observer<T>, fetchFunction: FetchFunction<T>) {
    const result = await fetchFunction(url);
    const links = parselinkheader(result.linkHeader);
    const nextUrl = (links.next ? links.next.url : null);
    const json = result.content;
    obs.next(json);
    if (nextUrl && url !== links.last.url) {
        let absoluteNextUrl = nextUrl;
        if (nextUrl.substr(0, 1) === "/") {
            const u = urlmodule.parse(url);
            absoluteNextUrl = u.protocol + "//" + (u.auth ? u.auth + "@" : "") + u.host + absoluteNextUrl;
        }
        await fetcher(absoluteNextUrl, obs, fetchFunction);
    }
}

export const wrap = <T>(f: (url: string | Request, init?: RequestInit) => Promise<Response>) =>
    async (url: string) => {
        const response = await f(url);
        const linkHeader = response.headers.get("Link");
        const content = await response.json() as T;
        return {
            content,
            linkHeader,
        };
    };

export default function getLinkedUrlObservables<T>(
    url: string,
    fetchFunction = wrap<T>(fetch)):
    Rx.Observable<T> {
    return Rx.Observable.create((obs: Rx.Observer<T>) => {
        fetcher(url, obs, fetchFunction).then(
            () => obs.complete(),
            (err) => obs.error(err));
    });
}