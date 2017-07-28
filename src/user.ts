import { MongoClient, Db } from 'mongodb';

var db: Db = null;

const connect = () => {
    if (db) {
        return Promise.resolve(db);
    } else {
        return new Promise<Db>((resolve, reject) => {
            var url = process.env.MONGODB_URI ||
                'mongodb://legendaryquest:legendaryquest@localhost:27017/legendaryquest';
            console.log(`Using url ${url}`);
            MongoClient.connect(url, (err, result) => {
                if (err) {
                    console.log("Connection failed.");
                    reject(err);
                    return;
                }
                db = result;
                console.log("Connected.");
                resolve(db);
            });
        })
    }
}

export interface IUserModule {
    getName(): Promise<string>
};

export const getName = () =>
    connect()
        .then(db => db.collection('users').find({ id: 0 }).limit(1).toArray())
        .then(arr => arr.length == 1 ?
            arr[0].name :
            db.collection('users').insertOne({ id: 0, name: 'RedGlow' }).then(() => 'RedGlow'));