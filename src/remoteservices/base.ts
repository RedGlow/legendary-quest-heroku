import * as Rx from "rxjs/Rx";

export const feedObservable = <T>(feeder: (observer: Rx.Observer<T[]>) => Promise<void>): Rx.Observable<T[]> =>
    Rx.Observable.create((observer: Rx.Observer<T[]>) =>
        feeder(observer).then(
            () => observer.complete(),
            (err) => observer.error(err)));
