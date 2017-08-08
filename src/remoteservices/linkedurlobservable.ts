import fetch, { Request, Response } from "node-fetch";
import * as parselinkheader from "parse-link-header";
import * as Rx from "rxjs/Rx";
import * as urlmodule from "url";

export type FetchFunction<T> = (url: string) => Promise<{ content: T, linkHeader: string }>;

let maxPages: number = -1;

export function setMaxPages(newMaxPages: number) {
    maxPages = newMaxPages;
}

async function fetcher<T>(
    url: string,
    obs: Rx.Observer<T>,
    fetchFunction: FetchFunction<T>,
    currPage: number) {
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
        if (maxPages < 0 || currPage < maxPages - 1) {
            await fetcher(absoluteNextUrl, obs, fetchFunction, currPage + 1);
        }
    }
}

export const wrap = <T>(f: (url: string | Request, init?: RequestInit) => Promise<Response>) =>
    async (url: string) => {
        const response = await f(url);
        if (response.status < 200 || response.status >= 300) {
            const body = await response.text();
            throw new Error(`Server returned status ${response.status} with body ${body}`);
        }
        const linkHeader = response.headers.get("Link");
        const content = await response.json() as T;
        return {
            content,
            linkHeader,
        };
    };

const getLinkedUrlObservables = <T>(
    url: string,
    fetchFunction = wrap<T>(fetch)):
    Rx.Observable<T> =>
    Rx.Observable.create((obs: Rx.Observer<T>) =>
        fetcher(url, obs, fetchFunction, 0).then(
            obs.complete.bind(obs),
            obs.error.bind(obs)));

export default getLinkedUrlObservables;
