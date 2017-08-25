import { get as conf } from "../configuration";
import { strictShift } from "../func";

export class Bucket {
    private bucketSize: number;
    private lastCheckedTime: number;
    private pendingRequests: Array<() => void> = [];
    private resolvePendingRequestsTimerRunning = false;

    public constructor(
        startingBucketSize: number,
        private maxBucketSize: number,
        private millisecondsBetweenRequests: number) {
        this.bucketSize = startingBucketSize;
        this.lastCheckedTime = conf().getTime();
    }

    public getToken(): Promise<void> {
        const promise = this.enqueueTokenRequest();
        this.resolvePendingRequests();
        return promise;
    }

    private enqueueTokenRequest(): Promise<void> {
        return new Promise((resolve) => {
            this.pendingRequests.push(resolve);
        });
    }

    private updateBucketSize() {
        // before returning a token, we update the bucket size
        const currentTime = conf().getTime();
        const delta = currentTime - this.lastCheckedTime;
        const numGainedTokens = Math.floor(delta / this.millisecondsBetweenRequests);
        this.bucketSize = Math.min(this.maxBucketSize, this.bucketSize + numGainedTokens);

        // we set the "last time checked" to the last time a token was effectively gained in order not to
        // lose tokens because of approximations
        const lastTimeTokenWasGained = this.lastCheckedTime + numGainedTokens * this.millisecondsBetweenRequests;
        this.lastCheckedTime = lastTimeTokenWasGained;
    }

    private resolvePendingRequests() {
        this.updateBucketSize();
        this.resolvePendingRequestsTimerRunning = false;
        while (this.bucketSize > 0 && this.pendingRequests.length > 0) {
            this.bucketSize--;
            strictShift(this.pendingRequests)();
        }
        if (!this.resolvePendingRequestsTimerRunning &&
            this.bucketSize === 0 &&
            this.pendingRequests.length > 0) {
            this.resolvePendingRequestsTimerRunning = true;
            let waitTime = this.lastCheckedTime + this.millisecondsBetweenRequests - conf().getTime();
            if (waitTime === 0) {
                waitTime += this.millisecondsBetweenRequests;
            }
            conf()
                .waitTime(waitTime)
                .then(this.resolvePendingRequests.bind(this));
        }
    }
}
