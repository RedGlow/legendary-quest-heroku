import * as Rx from "rxjs/Rx";

export function feedObservable<T>(feeder: (observer: Rx.Observer<T[]>) => Promise<void>): Rx.Observable<T[]> {
    return Rx.Observable.create((observer: Rx.Observer<T[]>) => {
        feeder(observer).then(() => observer.complete(), (err) => observer.error(err));
    });
}
