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

export const deepEqual = (e1: any, e2: any) => {
    if (!libraryDeepEqual(e1, e2)) {
        const j1 = JSON.stringify(e1);
        const j2 = JSON.stringify(e2);
        throw new Error(
            `not deep equal
      expected:
        ${j1}
      actual:
        ${j2}
    `);
    }
};
