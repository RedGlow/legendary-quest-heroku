import { Db, MongoClient } from "mongodb";

export const dropDb = () => {
    process.env.MONGODB_URI = process.env.MONGODB_URI ||
        "mongodb://legendaryquesttest:legendaryquesttest@localhost:27017/legendaryquesttest";
    return new Promise<Db>((resolve, reject) => {
        const mongodbUri = process.env.MONGODB_URI;
        if (mongodbUri === undefined) {
            throw new Error("MONGODB_URI must be set in the environment");
        }
        MongoClient.connect(mongodbUri, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    }).then((db) => db.dropDatabase());
};
