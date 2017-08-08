import { switchcase } from "../func";
import { IRecipe, IRecipeItem, RecipeType } from "../recipe";
import { IMyRecipe } from "../remoteservices/gw2efficiency";

export const sourceName = "GW2Efficiency";

const getCurrencyName = switchcase({
    /* tslint:disable:object-literal-sort-keys */
    "karma": "Karma",
    "spirit-shard": "Spirit Shard",
    "gold": "Coin",
    "badge-of-honor": "Badge of Honor",
    "geode": "Geode",
    "pristine-fractal-relic": "Pristine Fractal Relic",
    "fractal-relic": "Fractal Relic",
    "wvw-tournament-claim-ticket": "WvW Tournament Claim Ticket",
    "ascalonian-catacombs": "Ascalonian Tear",
    "caudecuss-manor": "Seal of Beetletun",
    "twilight-arbor": "Deadly Bloom",
    "sorrows-embrace": "Manifesto of the Moletariate",
    "citadel-of-flame": "Flame Legion Charr Carving",
    "honor-of-the-waves": "Symbol of Koda",
    "crucible-of-eternity": "Knowledge Crystal",
    "the-ruined-city-of-arah": "Shard of Zhaitan",
    "guild-commendation": "Guild Commendation",
    /* tslint:enable:object-literal-sort-keys */
})((myName) => { throw new Error(`Unknown currency name ${myName}`); });

export const transformRecipe = (recipe: IMyRecipe): IRecipe =>
    ({
        _id: null,
        base_id: null,
        ingredients: [{
            amount: recipe.cost,
            name: getCurrencyName(recipe.type),
        }],
        location: null, // TODO
        prerequisites: [],
        results: [{
            amount: recipe.quantity,
            id: recipe.id,
        }],
        source: sourceName,
        subtype: null,
        timestamp: null,
        type: "Vendor" as RecipeType,
    });
