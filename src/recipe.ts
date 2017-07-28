export type RecipeType = "MysticForge" | "Salvage" | "Vendor" | "Charge" | "DoubleClick" | "Achievement";

export interface Recipe {
    // id of the recipe document - see setRecipeId
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
    ingredients: (RecipeItem | RecipeCurrency | Achievement)[];
    // The result(s) of this recipe
    results: (RecipeItem | RecipeCurrency)[];
    // List of special prerequisites for using this recipe (e.g.: completing an achievement to unlock a vendor)
    prerequisites: AchievementPrerequisite[];
    // Location where this recipe can be performed, if specific (e.g.: not mystic forge)
    location: Location;
    // Source from where this recipe was obtained
    source: string;
    // timestamp
    timestamp: Date;
}

// A recipe item, as an ingredient or result, with its quantity
export interface RecipeItem {
    // ID of the item (according to the official API)
    id: number;
    // amount of the item produced or required
    amount: number;
}

// A currency amount, as an "ingredient" of a recipe (e.g.: vendor cost)
export interface RecipeCurrency {
    // name of the recipe (according to the official API)
    name: string;
    // amount required
    amount: number;
}

// An achievement ingredient
export interface Achievement {
    // the id of the achievement required
    achievement_id: number;
}

// Prerequisites expressed as an achievement id to complete
export interface AchievementPrerequisite {
    achievement_id: number;
}

export interface Location {
    // In-game link to the location
    game_link: string;
    // User name to display (name of the location, or of the vendor)
    label: string;
}

export function setRecipeId(r: Recipe) {
    // sort elements, since these are sets
    r.results.sort(compareRecipeElements);
    r.ingredients.sort(compareRecipeElements);
    // generate key
    r._id = generateRecipeElementsSubkey(r.ingredients) + "=" + generateRecipeElementsSubkey(r.results);
}

export function isRecipeItem(el: RecipeCurrency | RecipeItem | Achievement): el is RecipeItem {
    return (<RecipeItem>el).id !== undefined;
}

export function isRecipeCurrency(el: RecipeCurrency | RecipeItem | Achievement): el is RecipeCurrency {
    return (<RecipeCurrency>el).name !== undefined;
}

// A comparison function to totally order recipe elements
function compareRecipeElements(el1: RecipeCurrency | RecipeItem, el2: RecipeCurrency | RecipeItem): number {
    let isEl1Item = isRecipeItem(el1),
        isEl2Item = isRecipeItem(el2);
    if (isEl1Item != isEl2Item) {
        return (isEl1Item ? 1 : 0) - (isEl2Item ? 1 : 0);
    } else if (isEl1Item) {
        return (<RecipeItem>el1).id - (<RecipeItem>el2).id;
    } else {
        return (<RecipeCurrency>el1).name.localeCompare((<RecipeCurrency>el2).name);
    }
}

// given a list of elements, generate a string key summarizing that list of elements
function generateRecipeElementsSubkey(elements: (RecipeCurrency | RecipeItem | Achievement)[]): string {
    return elements.map(element => {
        if (isRecipeItem(element)) {
            return element.id.toString();
        } else if (isRecipeCurrency(element)) {
            return element.name;
        } else {
            return `~a${element.achievement_id}`;
        }
    }).join(',');
}

/*
- The official API (the [recipes](https://api.guildwars2.com/v2/recipes) endpoint)
- *The gw2shinies API (the [forge](https://www.gw2shinies.com/api/json/forge/) endpoint documented [here](http://www.gw2shinies.com/doc-api.php#forge))
- *The vendor list (can be taken from [gw2efficiency](https://github.com/gw2efficiency/recipe-calculation/blob/master/src/static/vendorItems.js))
- *The gw2profits list (can be taken from [gw2profits endpoint](http://gw2profits.com/json/v2/forge))
- The ingredients list (from wiki: http://wiki.guildwars2.com/wiki/Ingredient)
*/