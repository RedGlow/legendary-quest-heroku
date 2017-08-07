import { Request, Response } from "node-fetch";
import * as Rx from "rxjs/Rx";

export const feedObservable = <T>(feeder: (observer: Rx.Observer<T[]>) => Promise<void>): Rx.Observable<T[]> =>
    Rx.Observable.create((observer: Rx.Observer<T[]>) =>
        feeder(observer).then(
            () => observer.complete(),
            (err) => observer.error(err)));

export const fetchwrap = <T>(f: (url: string | Request, init?: RequestInit) => Promise<Response>) =>
    (url: string) => f(url).then((response) =>
        response.status >= 200 && response.status < 300 ?
            response.json() as Promise<T> :
            response.text().then((t) => Promise.reject(t)));
