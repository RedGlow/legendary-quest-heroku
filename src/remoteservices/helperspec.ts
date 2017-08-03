import * as assert from "assert";
import * as Rx from "rxjs/Rx";

export interface IValueEvent {
    event: "value";
    value: any;
}

export interface IErrorEvent {
    event: "error";
    value: any;
}

export type Event = IValueEvent | IErrorEvent;

export default function checkObservable<T>(observable: Rx.Observable<T[]>, expectedEvents: Event[]): Promise<void> {
    const events: Event[] = [];
    /* tslint:disable:no-console */
    observable.subscribe({
        error: (error) => events.push({ event: "error", value: error }),
        next: (value) => events.push({ event: "value", value }),
    });
    /* tslint:enable:no-console */
    return observable
        .toPromise()
        .then(() => {
            assert.deepEqual(events, expectedEvents);
        });
}
