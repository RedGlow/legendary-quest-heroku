import * as assert from 'assert';
import * as Rx from 'rxjs/Rx';

export interface ValueEvent {
    event: 'value';
    value: any;
}

export interface ErrorEvent {
    event: 'error';
    value: any;
}

export type Event = ValueEvent | ErrorEvent;

export default function checkObservable<T>(observable: Rx.Observable<T[]>, expectedEvents: Event[]): Promise<void> {
    var events: Event[] = [];
    observable.subscribe({
        next: value => events.push({ event: 'value', value: value }),
        error: error => events.push({ event: 'error', value: error })
    });
    return observable.toPromise().then(() => assert.deepEqual(events, expectedEvents));
}