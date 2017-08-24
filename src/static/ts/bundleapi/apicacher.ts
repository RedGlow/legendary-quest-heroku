import { get as conf } from "../configuration";

const createCacher = (
    call: (path: string, id: number) => Promise<any>,
    defaultEndpointTimeout: number,
    {
        endpointTimeouts = {} as { [path: string]: number },
    } = {}) => {
    const getKeyName = (path: string, id: number) => "apicacher-" + path + "-" + id.toString();

    const getTimeFromValue = (value: string) => parseInt(value.substr(0, value.indexOf(",")), 10);

    const getObjectFromValue = (value: string) => JSON.parse(value.substr(value.indexOf(",") + 1));

    const getValue = (time: number, obj: any) => time.toString() + "," + JSON.stringify(obj);

    const cacheGet = (path: string, id: number): Promise<any> => {
        const cached = conf().localStorage.getItem(getKeyName(path, id));
        if (cached !== null) {
            const time = getTimeFromValue(cached);
            if (conf().getTime() < time + (endpointTimeouts[path] || defaultEndpointTimeout)) {
                return Promise.resolve(getObjectFromValue(cached));
            }
        }
        return call(path, id).then((result) => {
            conf().localStorage.setItem(
                getKeyName(path, id),
                getValue(conf().getTime(), result));
            return result;
        });
    };

    return cacheGet;
};

export default createCacher;
