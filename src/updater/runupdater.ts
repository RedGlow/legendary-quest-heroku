import { update } from "./dbupdater";
import { getRecipeBlocksObservable } from "./updater";

update(getRecipeBlocksObservable());
