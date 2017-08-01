import { Db, MongoClient } from "mongodb";

export const dropDb = () => {
    process.env.MONGODB_URI = process.env.MONGODB_URI ||
        "mongodb://legendaryquesttest:legendaryquesttest@localhost:27017/legendaryquesttest";
    return new Promise<Db>((resolve, reject) => {
        MongoClient.connect(process.env.MONGODB_URI, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    }).then((db) => db.dropDatabase());
};
