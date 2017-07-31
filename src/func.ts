const executeIfFunction = <T>(f: T | ((key: string) => T), arg: string) =>
  typeof f === "function" ? f(arg) : f
  ;

const toString = (key: string | number) =>
  typeof key === "number" ? key.toString() : key;

export const switchcaseC: <T>(cases: { [id: string]: T }) =>
  ((defaultCase: T) => ((key: string | number) => T)) =
  (cases) => (defaultCase) => (key) =>
    toString(key) in cases ? cases[key] : defaultCase
  ;

export const switchcase: <T>(cases: { [id: string]: T | ((key: string) => T) }) =>
  ((defaultCase: T | ((key: string) => T)) => ((key: string) => T)) =
  (cases) => (defaultCase) => (key) =>
    executeIfFunction(switchcaseC(cases)(defaultCase)(key), key)
  ;
