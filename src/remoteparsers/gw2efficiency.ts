import { IRecipe, IRecipeItem, RecipeType } from "../recipe";
import { IMyRecipe } from "../remoteservices/gw2efficiency";

function getCurrencyName(myName: string) {
    switch (myName) {
        case "karma": return "Karma";
        case "spirit-shard": return "Spirit Shard";
        case "gold": return "Coin";
        case "badge-of-honor": return "Badge of Honor";
        case "geode": return "Geode";
        case "pristine-fractal-relic": return "Pristine Fractal Relic";
        case "fractal-relic": return "Fractal Relic";
        case "wvw-tournament-claim-ticket": return "WvW Tournament Claim Ticket";
        case "ascalonian-catacombs": return "Ascalonian Tear";
        case "caudecuss-manor": return "Seal of Beetletun";
        case "twilight-arbor": return "Deadly Bloom";
        case "sorrows-embrace": return "Manifesto of the Moletariate";
        case "citadel-of-flame": return "Flame Legion Charr Carving";
        case "honor-of-the-waves": return "Symbol of Koda";
        case "crucible-of-eternity": return "Knowledge Crystal";
        case "the-ruined-city-of-arah": return "Shard of Zhaitan";
        case "guild-commendation": return "Guild Commendation";
        default: throw new Error(`Unknown currency name ${myName}`);
    }
}

export const transformRecipes = (recipes: IMyRecipe[]): IRecipe[] =>
    recipes.map((el) => ({
        _id: null,
        ingredients: [{
            amount: el.cost,
            name: getCurrencyName(el.type),
        }],
        location: null, // TODO
        prerequisites: [],
        results: [{
            amount: el.quantity,
            id: el.id,
        }],
        source: "GW2Efficiency",
        subtype: null,
        timestamp: null,
        type: "Vendor" as RecipeType,
    }));
