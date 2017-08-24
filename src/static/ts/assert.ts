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
