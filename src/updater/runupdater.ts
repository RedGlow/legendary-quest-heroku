import { close } from "../db";
import { update } from "./dbupdater";
import { getRecipeBlocksObservable } from "./updater";

async function doAll() {
    try {
        /* tslint:disable:no-console */
        console.log("Starting the recipe feeder.");
        const observable = getRecipeBlocksObservable();
        console.log("Feeding it to the updater.");
        await update(observable);
        console.log("Closing the connection.");
        await close();
        console.log("All done.");
    } catch (e) {
        console.error(e);
        /* tslint:enable:no-console */
    }
}

doAll();
