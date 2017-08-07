export type RecipeType = "MysticForge" | "Salvage" | "Vendor" | "Charge" | "DoubleClick" | "Achievement";

export interface IRecipe {
    // id of the recipe document - see getRecipeId
    _id: string;
    // The type of this recipe, identifying the way it is executed
    // MysticForge: a recipe produced at the mystic forge
    // Salvage: a recipe produced salvaging the item (only one ingredient allowed)
    // Vendor: a "recipe" executed by buying items from a vendor
    // Charge: a "recipe" executed by charging an item in a place of power
    // DoubleClick: a "recipe" executed by double clicking the items
    // Achievement: a "recipe" executed by obtaining the relative achievement;
    //   has an implicit prerequisites that the achievement isn't obtained yet
    type: RecipeType;
    // The subtype of this recipe, dependent on the main type
    subtype: string;
    // The ingredient(s) of this recipe
    ingredients: Array<IRecipeItem | IRecipeCurrency | IAchievement>;
    // The result(s) of this recipe
    results: Array<IRecipeItem | IRecipeCurrency>;
    // List of special prerequisites for using this recipe (e.g.: completing an achievement to unlock a vendor)
    prerequisites: IAchievementPrerequisite[];
    // Location where this recipe can be performed, if specific (e.g.: not mystic forge)
    location: ILocation;
    // Source from where this recipe was obtained
    source: string;
    // timestamp
    timestamp: Date;
}

// A recipe item, as an ingredient or result, with its quantity
export interface IRecipeItem {
    // ID of the item (according to the official API)
    id: number;
    // amount of the item produced or required
    amount: number;
}

// A currency amount, as an "ingredient" of a recipe (e.g.: vendor cost)
export interface IRecipeCurrency {
    // name of the recipe (according to the official API)
    name: string;
    // amount required
    amount: number;
}

// An achievement ingredient
export interface IAchievement {
    // the id of the achievement required
    achievement_id: number;
}

// Prerequisites expressed as an achievement id to complete
export interface IAchievementPrerequisite {
    achievement_id: number;
}

export interface ILocation {
    // In-game link to the location
    game_link: string;
    // User name to display (name of the location, or of the vendor)
    label: string;
}

export function getRecipeId(r: IRecipe) {
    // sort elements, since these are sets
    r.results.sort(compareRecipeElements);
    r.ingredients.sort(compareRecipeElements);
    // generate key
    return generateRecipeElementsSubkey(r.ingredients) + "=" + generateRecipeElementsSubkey(r.results);
}

export function isRecipeItem(el: IRecipeCurrency | IRecipeItem | IAchievement): el is IRecipeItem {
    return (el as IRecipeItem).id !== undefined;
}

export function isRecipeCurrency(el: IRecipeCurrency | IRecipeItem | IAchievement): el is IRecipeCurrency {
    return (el as IRecipeCurrency).name !== undefined;
}

// A comparison function to totally order recipe elements
function compareRecipeElements(el1: IRecipeCurrency | IRecipeItem, el2: IRecipeCurrency | IRecipeItem): number {
    const isEl1Item = isRecipeItem(el1);
    const isEl2Item = isRecipeItem(el2);
    if (isEl1Item !== isEl2Item) {
        return (isEl1Item ? 1 : 0) - (isEl2Item ? 1 : 0);
    } else if (isEl1Item) {
        return (el1 as IRecipeItem).id - (el2 as IRecipeItem).id;
    } else {
        return (el1 as IRecipeCurrency).name.localeCompare((el2 as IRecipeCurrency).name);
    }
}

// given a list of elements, generate a string key summarizing that list of elements
const generateRecipeElementsSubkey = (elements: Array<IRecipeCurrency | IRecipeItem | IAchievement>) =>
    elements.map((element) =>
        isRecipeItem(element) ? element.id.toString() :
            isRecipeCurrency(element) ? element.name :
                `~a${element.achievement_id}`)
        .join(",");

/*
- The official API (the [recipes](https://api.guildwars2.com/v2/recipes) endpoint)
- * The gw2shinies API (the [forge](https://www.gw2shinies.com/api/json/forge/)
-   endpoint documented [here](http://www.gw2shinies.com/doc-api.php#forge))
- * The vendor list (can be taken from
    [gw2efficiency](https://github.com/gw2efficiency/recipe-calculation/blob/master/src/static/vendorItems.js))
- * The gw2profits list (can be taken from [gw2profits endpoint](http://gw2profits.com/json/v2/forge))
- The ingredients list (from wiki: http://wiki.guildwars2.com/wiki/Ingredient)
*/
