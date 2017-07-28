import * as http from 'http';
import * as https from 'https';

export function get(url: string): Promise<string> {
    var completed = false;
    return new Promise<string>((resolve, reject) => {
        var method = url.startsWith('https:') ? https.request : http.request;
        var clientRequest = method(url, res => {
            res.setEncoding('utf8');
            var buffer: (string | Buffer)[] = [];
            res.on('data', chunk => {
                buffer.push(chunk);
            })
            res.on('end', () => {
                if (!completed) {
                    try {
                        var str = buffer.join('');
                        completed = true;
                        resolve(str);
                    } catch (e) {
                        completed = true;
                        reject(e);
                    }
                }
            });
        });
        clientRequest.on('error', err => {
            if (!completed) {
                reject(err);
            }
        });
        clientRequest.end();
    });
}

var alternativeGet: (url: string) => Promise<string> = null;

export async function getJSON<T>(url: string): Promise<T> {
    var str = await (alternativeGet || get)(url);
    var result = <T>JSON.parse(str);
    return result;
}

export function setAlternativeGet(f: (url: string) => Promise<string>) {
    alternativeGet = f;
}