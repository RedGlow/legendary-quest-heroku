import { get as conf } from "../configuration";

let nextId = 0;

const createCacher = <TArgs extends any[]>(
    call: (args: TArgs) => Promise<any>,
    endpointTimeouts: (args: TArgs) => number) => {
    const myId = nextId;
    nextId++;

    const toString = (arg: any): string => {
        const targ = typeof arg;
        if (targ === "string") {
            return arg;
        } else if (targ === "number") {
            return arg.toString();
        } else {
            throw new Error(`Unknown type ${targ}`);
        }
    };

    const getKeyName = (args: TArgs) => "apicacher-" + myId + "-" + args.map(toString).join("-");

    const getTimeFromValue = (value: string) => parseInt(value.substr(0, value.indexOf(",")), 10);

    const getObjectFromValue = (value: string) => JSON.parse(value.substr(value.indexOf(",") + 1));

    const getValue = (time: number, obj: any) => time.toString() + "," + JSON.stringify(obj);

    const cacheGet = (args: TArgs): Promise<any> => {
        const cached = conf().localStorage.getItem(getKeyName(args));
        if (cached !== null) {
            const time = getTimeFromValue(cached);
            if (conf().getTime() < time + endpointTimeouts(args)) {
                return Promise.resolve(getObjectFromValue(cached));
            }
        }
        return call(args).then((result) => {
            conf().localStorage.setItem(
                getKeyName(args),
                getValue(conf().getTime(), result));
            return result;
        });
    };

    return cacheGet;
};

export default createCacher;
