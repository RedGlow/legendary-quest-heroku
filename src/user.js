var MongoClient = require('mongodb').MongoClient
    ;

var url = process.env.MONGODB_URI ||
    'mongodb://legendaryquest:legendaryquest@localhost:27017/legendaryquest';

var db = null;

const connect = () => {
    if (db) {
        return Promise.resolve(db);
    } else {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                db = result;
                resolve(db);
            });
        })
    }
}

module.exports = {
    getName: () => {
        return connect().then(db => {
            return "RedGlow";
        });
    }
}