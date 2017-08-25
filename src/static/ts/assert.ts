import libraryDeepEqual = require("deep-equal");

export const equal = (actual: any, expected: any, msg: string = "") => {
    if (actual !== expected) {
        throw new Error(
            `not ok - ${msg}
      expected:
        ${ expected}
      actual:
        ${ actual}
    `);
    }
};

export const deepEqual = (actual: any, expected: any) => {
    if (!libraryDeepEqual(actual, expected)) {
        const jactual = JSON.stringify(actual);
        const jexpected = JSON.stringify(expected);
        throw new Error(
            `not deep equal
      expected:
        ${jexpected}
      actual:
        ${jactual}
    `);
    }
};

export function mustNotBeNull<T>(value: T | null): value is T {
    if (value === null) {
        throw new Error(`value is null`);
    } else {
        return true;
    }
}

export const throws = (f: () => void) => {
    try {
        f();
    } catch (e) {
        return;
    }
    throw new Error("Function hasn't thrown an error");
};
