Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var db = null;
var connect = function () {
    if (db) {
        return Promise.resolve(db);
    }
    else {
        return new Promise(function (resolve, reject) {
            var url = process.env.MONGODB_URI ||
                'mongodb://legendaryquest:legendaryquest@localhost:27017/legendaryquest';
            console.log("Using url " + url);
            mongodb_1.MongoClient.connect(url, function (err, result) {
                if (err) {
                    console.log("Connection failed.");
                    reject(err);
                    return;
                }
                db = result;
                console.log("Connected.");
                resolve(db);
            });
        });
    }
};
;
exports.getName = function () {
    return connect()
        .then(function (db) { return db.collection('users').find({ id: 0 }).limit(1).toArray(); })
        .then(function (arr) { return arr.length == 1 ?
        arr[0].name :
        db.collection('users').insertOne({ id: 0, name: 'RedGlow' }).then(function () { return 'RedGlow'; }); });
};
