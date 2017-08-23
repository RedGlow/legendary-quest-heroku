export interface IConfiguration {
    fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
    getTime: () => number;
    waitTime: (time: number) => Promise<void>;
}

let configuration: IConfiguration = null;

export const set = (c: IConfiguration) => {
    configuration = c;
};

export const get = () => {
    if (configuration === null) {
        throw new Error("Configuration not set yet.");
    } else {
        return configuration;
    }
};
