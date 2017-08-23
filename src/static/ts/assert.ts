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
