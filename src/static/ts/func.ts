export const intObjectKeys = (obj: any) => Object.keys(obj).map((sid) => parseInt(sid, 10));

export const strictShift = <T>(arr: T[]) => {
    const el = arr.shift();
    if (el === undefined) {
        throw new Error("Cannot shift from a 0-length array.");
    } else {
        return el;
    }
};
