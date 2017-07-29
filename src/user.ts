import { Db, MongoClient } from "mongodb";

let dbinstance: Db = null;

const connect = () => {
    if (dbinstance) {
        return Promise.resolve(dbinstance);
    } else {
        return new Promise<Db>((resolve, reject) => {
            const url = process.env.MONGODB_URI ||
                "mongodb://legendaryquest:legendaryquest@localhost:27017/legendaryquest";
            MongoClient.connect(url, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                dbinstance = result;
                resolve(dbinstance);
            });
        });
    }
};

export interface IUserModule {
    getName(): Promise<string>;
}

export const getName = () =>
    connect()
        .then((db) => db.collection("users").find({ id: 0 }).limit(1).toArray())
        .then((arr) => arr.length === 1 ?
            arr[0].name :
            dbinstance.collection("users").insertOne({ id: 0, name: "RedGlow" }).then(() => "RedGlow"));
