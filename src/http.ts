import * as http from "http";
import * as https from "https";

let alternativeGet: (url: string) => Promise<string> = null;

export function get(url: string): Promise<string> {
    if (alternativeGet) {
        return alternativeGet(url);
    }
    let completed = false;
    return new Promise<string>((resolve, reject) => {
        const method = url.startsWith("https:") ? https.request : http.request;
        const clientRequest = method(url, (res) => {
            res.setEncoding("utf8");
            const buffer: Array<string | Buffer> = [];
            res.on("data", (chunk) => {
                buffer.push(chunk);
            });
            res.on("end", () => {
                if (!completed) {
                    try {
                        completed = true;
                        resolve(buffer.join(""));
                    } catch (e) {
                        completed = true;
                        reject(e);
                    }
                }
            });
        });
        clientRequest.on("error", (err) => {
            if (!completed) {
                reject(err);
            }
        });
        clientRequest.end();
    });
}

export async function getJSON<T>(url: string): Promise<T> {
    const str = await get(url);
    const result = JSON.parse(str) as T;
    return result;
}

export function setAlternativeGet(f: (url: string) => Promise<string>) {
    alternativeGet = f;
}
