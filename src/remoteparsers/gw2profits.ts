import { switchcase } from "../func";
import { getJSON } from "../http";
import { IRecipe, IRecipeCurrency, IRecipeItem, RecipeType } from "../recipe";
import { IMyIngredient, IMyRecipe } from "../remoteservices/gw2profits";

const recipeDisciplinesToRecipeTypeSwitchCase = switchcase<RecipeType>({
    "Charge": "Charge",
    "Double Click": "DoubleClick",
    "Double click": "DoubleClick",
    "Merchant": "Vendor",
    "Mystic Forge": "MysticForge",
    "Salvage": "Salvage",
})((d) => { throw new Error(`Unknown discipline ${d}`); });
const recipeDisciplinesToRecipeType = (recipe: IMyRecipe): RecipeType =>
    recipeDisciplinesToRecipeTypeSwitchCase(recipe.disciplines[0]);

const getIngredientSwitchCase = switchcase({
    /* tslint:disable:object-literal-sort-keys */
    "-1": "Coin",
    "-2": "Karma",
    "-3": "Laurel",
    "-4": "Gem",
    "-5": "Ascalonian Tear",
    "-6": "Shard of Zhaitan",
    "-7": "Fractal Relic",
    "-9": "Seal of Beetletun",
    "-10": "Manifesto of the Moletariate",
    "-11": "Deadly Bloom",
    "-12": "Symbol of Koda",
    "-13": "Flame Legion Charr Carving",
    "-14": "Knowledge Crystal",
    "-15": "Badge of Honor",
    "-16": "Guild Commendation",
    "-18": "Transmutation Charge",
    "-19": "Airship Part",
    "-20": "Ley Line Crystal",
    "-22": "Lump of Aurillium",
    "-23": "Spirit Shard",
    "-24": "Pristine Fractal Relic",
    "-25": "Geode",
    "-26": "WvW Tournament Claim Ticket",
    "-27": "Bandit Crest",
    "-28": "Magnetite Shard",
    "-29": "Provisioner Token",
    "-30": "PvP League Ticket",
    "-31": "Proof of Heroics",
    "-32": "Unbound Magic",
    /* tslint:enable:object-literal-sort-keys */
});
const getIngredient = (inputIngredient: IMyIngredient): IRecipeItem | IRecipeCurrency =>
    inputIngredient.item_id > 0 ?
        {
            amount: inputIngredient.count,
            id: inputIngredient.item_id,
        }
        :
        {
            amount: inputIngredient.count,
            name: getIngredientSwitchCase(() => {
                throw new Error(`Unknown GW2 Profits id ${inputIngredient.item_id}`);
            })(inputIngredient.item_id.toString()),
        };

export const transformRecipe = (recipe: IMyRecipe): IRecipe => ({
    _id: null,
    ingredients: recipe.ingredients.map(getIngredient),
    location: null,
    prerequisites: [],
    results: [{
        amount: recipe.output_item_count,
        id: recipe.output_item_id,
    }],
    source: "GW2Profits",
    subtype: recipe.type,
    timestamp: null,
    type: recipeDisciplinesToRecipeType(recipe),
});
