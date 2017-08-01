import { Db, MongoClient } from "mongodb";
import { getRecipeId, IRecipe } from "./recipe";

interface ITimestamp {
    timestamp: Date;
}

let dbPromise: Promise<Db> = null;

const connect = () =>
    dbPromise || (dbPromise = new Promise<Db>((resolve, reject) => {
        const url = process.env.MONGODB_URI ||
            "mongodb://legendaryquest:legendaryquest@localhost:27017/legendaryquest";
        MongoClient.connect(url, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    }));

export const close = async (forceClose: boolean = false) => {
    const db = await connect();
    dbPromise = null;
    await db.close(forceClose);
};

const getRecipesCollection = async () => (await connect()).collection("Recipes");
const getTimestampCollection = async () => (await connect()).collection("Timestamp");

const upsert = async (recipes: IRecipe[]) =>
    await (await getRecipesCollection()).bulkWrite(
        recipes
            .map((recipe) => ({ ...recipe, _id: getRecipeId(recipe) }))
            .map((recipe) => ({
                updateOne: {
                    filter: { _id: recipe._id },
                    update: recipe,
                    upsert: true,
                },
            })),
        {
            ordered: false,
        });

async function retry<T>(numRetry: number, func: () => Promise<T>) {
    // the whole retry cycle is due to: https://jira.mongodb.org/browse/SERVER-14322
    let attempt = 0;
    while (true) {
        try {
            return await func();
        } catch (e) {
            if (attempt < numRetry &&
                e instanceof Error &&
                e.name === "MongoError" &&
                (e as any).code === 11000) {
                attempt++;
            } else {
                throw e;
            }
        }
    }
}

export const saveRecipes = async (recipes: IRecipe[], timestamp: Date) => {
    const timestampedRecipes = recipes.map((recipe) => ({ ...recipe, timestamp }));
    await retry(
        10,
        () => upsert(timestampedRecipes));
};

export class NoTimestampError extends Error {
    constructor() {
        super("No timestamp found on db.");
        /* tslint:disable:max-line-length */
        // see https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, NoTimestampError.prototype);
        /* tslint:enable:max-line-length */
    }
}

export const getTimestamp = async () => {
    // get the newest timestamp
    const obj = await (await getTimestampCollection())
        .find({})
        .sort({ timestamp: -1 })
        .limit(1)
        .next();
    if (obj === null) {
        throw new NoTimestampError();
    }
    return (obj as ITimestamp).timestamp;
};

export const setTimestamp = async (timestamp: Date) => {
    const db = connect();
    // add new timestamp
    await (await getTimestampCollection()).insertOne({
        timestamp,
    });
    // delete older timestamps
    await (await getTimestampCollection()).deleteMany({
        timestamp: {
            $lt: timestamp,
        },
    });
};

export const getRecipesForItems = async (...ids: number[]): Promise<IRecipe[]> => {
    if (ids.length === 0) {
        return [];
    }
    const db = await connect();
    const timestamp = await getTimestamp();
    const orCondition = ids.map((id: number) => ({
        "results.id": id,
        "timestamp": timestamp,
    }));
    const recipes = await (await getRecipesCollection()).find({ $or: orCondition }).toArray();
    return recipes;
};