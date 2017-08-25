import { Db, MongoClient } from "mongodb";
import { getRecipeId, IRecipe } from "./recipe";
import { getRecipeUnlockId, IRecipeUnlock } from "./recipeunlock";

interface ITimestamp {
    timestamp: Date;
}

let dbPromise: Promise<Db> | null = null;

export const connect = () =>
    dbPromise || (dbPromise = new Promise<Db>((resolve, reject) => {
        const url = process.env.MONGODB_URI ||
            "mongodb://legendaryquest:legendaryquest@localhost:27017/legendaryquest";
        MongoClient.connect(url, (err, result) =>
            err ? reject(err) : resolve(result));
    }));

export const close = async (forceClose: boolean = false) => {
    const db = await connect();
    dbPromise = null;
    await db.close(forceClose);
};

const getRecipesCollection = async () => (await connect()).collection("Recipes");
const getRecipeUnlocksCollection = async () => (await connect()).collection("RecipeUnlocks");
const getTimestampCollection = async () => (await connect()).collection("Timestamp");

const upsert = async (recipes: IRecipe[]) =>
    await (await getRecipesCollection()).bulkWrite(
        recipes
            .map((recipe) => {
                const recipeId = getRecipeId(recipe);
                const extendedRecipe = {
                    ...recipe,
                    _id: recipeId + "-" + recipe.timestamp.getTime().toString(),
                    base_id: recipeId,
                };
                return {
                    updateOne: {
                        filter: { _id: extendedRecipe._id },
                        update: extendedRecipe,
                        upsert: true,
                    },
                };
            }),
        {
            ordered: false,
        });

const upsertUnlocks = async (recipeUnlocks: IRecipeUnlock[]) =>
    await (await getRecipeUnlocksCollection()).bulkWrite(
        recipeUnlocks
            .map((recipeUnlock) => {
                const recipeUnlockId = getRecipeUnlockId(recipeUnlock);
                const extendedRecipeUnlock = {
                    ...recipeUnlock,
                    _id: recipeUnlockId + "-" + recipeUnlock.timestamp.getTime().toString(),
                    base_id: recipeUnlockId,
                };
                return {
                    updateOne: {
                        filter: { _id: extendedRecipeUnlock._id },
                        update: extendedRecipeUnlock,
                        upsert: true,
                    },
                };
            }),
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

export const saveRecipeUnlocks = async (recipeUnlocks: IRecipeUnlock[], timestamp: Date) => {
    const timestampedRecipeUnlocks = recipeUnlocks.map((recipeUnlock) => ({ ...recipeUnlock, timestamp }));
    await retry(
        10,
        () => upsertUnlocks(timestampedRecipeUnlocks));
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

interface IWrappedRecipe {
    element: IRecipe[];
}

export const getRecipesForItems = async (...ids: number[]): Promise<IRecipe[]> => {
    if (ids.length === 0) {
        return [];
    }
    const db = await connect();
    const orCondition = ids.map((id: number) => ({
        "results.id": id,
    }));
    /* during updates, we could have more than one item with the same timestamp: here we filter them,
    taking only the last one */
    const recipesFromMongodb = (await (await getRecipesCollection())
        .aggregate([
            { $match: { $or: orCondition } },
            { $sort: { timestamp: -1 } },
            { $group: { _id: "$base_id", element: { $push: "$$ROOT" } } },
            { $project: { _id: 0, element: { $slice: ["$element", 0, 1] } } },
        ])
        .toArray());
    return recipesFromMongodb.map((el: IWrappedRecipe) => el.element[0]);
};

interface IWrapperRecipeUnlock {
    element: IRecipeUnlock[];
}

export const getRecipeUnlocksForIds = async (...ids: number[]): Promise<IRecipeUnlock[]> => {
    if (ids.length === 0) {
        return [];
    }
    const db = await connect();
    /* during updates, we could have more than one item with the same timestamp: here we filter them,
    taking only the last one */
    const unlocks = (await (await getRecipeUnlocksCollection())
        .aggregate([
            { $match: { recipe_id: { $in: ids } } },
            { $sort: { timestamp: -1 } },
            { $group: { _id: "$base_id", element: { $push: "$$ROOT" } } },
            { $project: { _id: 0, element: { $slice: ["$element", 0, 1] } } },
        ])
        .toArray());
    return unlocks.map((el: IWrapperRecipeUnlock) => el.element[0]);
};

export const cleanRecipes = async (source: string, timestamp: Date): Promise<void> => {
    const db = await connect();
    const recipesCollection = await getRecipesCollection();
    await recipesCollection.deleteMany({
        source,
        timestamp: {
            $lt: timestamp,
        },
    });
};

export const cleanRecipeUnlocks = async (timestamp: Date): Promise<void> => {
    const db = await connect();
    const recipeUnlocksCollection = await getRecipeUnlocksCollection();
    await recipeUnlocksCollection.deleteMany({
        timestamp: {
            $lt: timestamp,
        },
    });
};
