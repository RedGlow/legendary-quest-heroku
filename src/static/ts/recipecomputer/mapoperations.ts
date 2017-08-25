interface INumMapString {
    [id: string]: number;
}

interface INumMapNumber {
    [id: number]: number;
}

export const getFromMapStr = (map: { [id: string]: number }, key: string) =>
    map[key] === undefined ? 0 : map[key];

export const getFromMapNum = (map: { [id: number]: number }, key: number) =>
    map[key] === undefined ? 0 : map[key];
