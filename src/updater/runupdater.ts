import { close } from "../db";
import { update } from "./dbupdater";
import { getRecipeBlocksObservable } from "./updater";

update(getRecipeBlocksObservable()).then(() => close());
