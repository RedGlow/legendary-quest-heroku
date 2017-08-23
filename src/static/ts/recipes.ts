import {
    IAchievement as IMysticAPIAchievement,
    IAchievementPrerequisite as IMysticAPIAchievementPrerequisite,
    ILocation as IMysticAPILocation,
    IRecipe as IMysticAPIRecipe,
    IRecipeCurrency as IMysticAPIIRecipeCurrency,
    IRecipeItem as IMysticAPIRecipeItem,
} from "../../recipe";

export type Discipline = "Artificer" |
    "Armorsmith" |
    "Chef" |
    "Huntsman" |
    "Jeweler" |
    "Leatherworker" |
    "Tailor" |
    "Weaponsmith" |
    "Scribe";

export type APIRecipeFlag = "AutoLearned" | "LearnedFromItem";

export interface IOfficialAPIRecipe {
    id: number;
    output_item_id: number;
    output_item_count: number;
    disciplines: Discipline[];
    min_rating: number;
    flags: APIRecipeFlag[];
    ingredients: IOfficialAPIRecipeItem[];
    chat_link: string;
}

export interface IOfficialAPIRecipeItem {
    item_id: number;
    count: number;
}

export interface IBaseRecipe {
    ingredients: Array<IRecipeItem | IRecipeCurrency | IAchievement>;
    results: Array<IRecipeItem | IRecipeCurrency>;
    prerequisites: IAchievementPrerequisite[];
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

/* tslint:disable:no-empty-interface */
export interface IMysticRecipe extends IBaseRecipe {

}

export interface IOfficialRecipe extends IBaseRecipe {

}
/* tslint:enable:no-empty-interface */

export type IRecipe = IMysticRecipe | IOfficialRecipe;
