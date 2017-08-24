import * as _ from "lodash";
import createCacher from "./bundleapi/apicacher";
import createApi from "./bundleapi/apicreator";
import { Bucket } from "./bundleapi/bucket";
import { get as conf } from "./configuration";

export interface IRecipe {
    type: "MysticForge" | "Salvage" | "Vendor" | "Charge" | "DoubleClick" | "Achievement" | "Crafting";
    ingredients: Array<IRecipeItem | IRecipeCurrency | IAchievement>;
    results: Array<IRecipeItem | IRecipeCurrency>;
    prerequisites: Array<IAchievementPrerequisite | ICraftingPrerequisite>;
}

export interface ICraftingPrerequisite {
    disciplines: Discipline[];
    rating: number;
}

export type Discipline = "Artificer" |
    "Armorsmith" |
    "Chef" |
    "Huntsman" |
    "Jeweler" |
    "Leatherworker" |
    "Tailor" |
    "Weaponsmith" |
    "Scribe";

export interface IOfficialApiRecipe {
    output_item_id: number;
    output_item_count: number;
    min_rating: number;
    disciplines: Discipline[];
    ingredients: Array<{
        item_id: number;
        count: number;
    }>;
    id: number;
}

export interface IMysticApiRecipe {
    type: "MysticForge" | "Salvage" | "Vendor" | "Charge" | "DoubleClick" | "Achievement";
    ingredients: Array<IRecipeItem | IRecipeCurrency | IAchievement>;
    results: Array<IRecipeItem | IRecipeCurrency>;
    prerequisites: IAchievementPrerequisite[];
}

function isRecipeItem(x: IRecipeItem | IRecipeCurrency): x is IRecipeItem {
    return (x as IRecipeItem).id !== undefined;
}

export interface IRecipeItem {
    id: number;
    amount: number;
}

export interface IRecipeCurrency {
    name: string;
    amount: number;
}

export interface IAchievement {
    achievement_id: number;
}

export interface IAchievementPrerequisite {
    achievement_id: number;
}

export interface ICharacterEquipment {
    equipment: Array<{
        id: number;
    }>;
}

export interface ICharacterInventory {
    bags: Array<{
        id: number;
        size: number;
        inventory: Array<{
            id: number;
            count: number;
        }>;
    } | null>;
}

export interface IMaterial {
    id: number;
    category: number;
    count: number;
}

export interface IBankEntry {
    id: number;
    count: number;
    charges?: number;
}

export interface IItem {
    id: number;
    chat_link: string;
    name: string;
    icon: string;
    description: string;
}

export type TokenInfoPermission = "account" | "builds" | "characters" | "guilds" | "inventories" |
    "progressions" | "pvp" | "tradingpost" | "unlocks" | "wallet";

export interface ITokenInfo {
    id: string;
    name: string;
    permissions: TokenInfoPermission[];
}

export interface ICurrency {
    id: number;
    name: string;
    description: string;
    order: number;
    icon: string;
}

export interface IWalletEntry {
    id: number;
    value: number;
}

export interface IPrice {
    id: number;
    whitelisted: boolean;
    buys: {
        quantity: number;
        unit_price: number;
    };
    sells: {
        quantity: number;
        unit_price: number;
    };
}

export interface IApi {
    getAccountBank: (accessToken: string) => Promise<Array<IBankEntry | null>>;
    getAccountCharacterEquipment: (accessToken: string, characterName: string) => Promise<ICharacterEquipment>;
    getAccountCharacterInventory: (accessToken: string, characterName: string) => Promise<ICharacterInventory>;
    getAccountCharacters: (accessToken: string) => Promise<string[]>;
    getAccountMaterials: (accessToken: string) => Promise<IMaterial[]>;
    getAccountWallet: (accessToken: string) => Promise<IWalletEntry[]>;
    getCommercePrice: (id: number) => Promise<IPrice>;
    getCurrenciesIds: () => Promise<number[]>;
    getCurrency: (id: number) => Promise<ICurrency>;
    getItem: (id: number) => Promise<IItem>;
    getRecipesFromOutput: (outputId: number) => Promise<IRecipe[]>;
    getTokenInfo: (accessToken: string) => Promise<TokenInfoPermission>;
}

const getApi = (): IApi => {

    const officialApiBucket = new Bucket(0, 10, 100);

    const oapiBase = "https://api.guildwars2.com/v2";

    const officialApiBundle = createApi(
        officialApiBucket,
        oapiBase,
        "ids",
        "id");

    const officialApiBundleCacher = createCacher<[string, number]>(
        ([path, id]: [string, number]) => officialApiBundle(path, id),
        ([path, id]: [string, number]) => 24 * 60 * 60 * 1000);

    const officialApiRaw = (url: string) =>
        officialApiBucket
            .getToken()
            .then(() => conf().fetch(url))
            .then((response) => response.status < 200 || response.status >= 400 ?
                getResponseError(response) :
                response.json());

    const officialApiRawCacher = createCacher<[string]>(
        ([url]: [string]) => officialApiRaw(url),
        ([url]: [string]) => 24 * 60 * 60 * 1000);

    const mysticApiBucket = new Bucket(0, 1, 100);

    const mysticApiBundle = createApi(
        mysticApiBucket,
        "https://legendary-quest.herokuapp.com/api",
        "resultitemids",
        "", {
            getObjectId: (obj: any, idList: number[]) =>
                _.intersection(
                    idList,
                    (obj as IMysticApiRecipe)
                        .results
                        .filter(isRecipeItem)
                        .map((recipeItem) => recipeItem.id))[0],
        });

    const mysticApiBundleCacher = createCacher<[string, number]>(
        ([path, id]: [string, number]) => mysticApiBundle(path, id),
        ([path, id]: [string, number]) => 60 * 60 * 1000);

    const getResponseError = (response: Response) =>
        response
            .text()
            .then((text) => Promise.reject(`API error: status = ${response.status}, text = ${text}`));

    const getOApiUrl = (path: string, accessToken: string = null): [string] =>
        [oapiBase + path + (accessToken ? "?access_token" + accessToken : "")];

    const api = {
        getAccountBank: (accessToken: string): Promise<Array<IBankEntry | null>> =>
            officialApiRawCacher(getOApiUrl("/account/bank", accessToken)),
        getAccountCharacterEquipment: (accessToken: string, characterName: string): Promise<ICharacterEquipment> =>
            officialApiRawCacher(getOApiUrl(`/characters/${characterName}/equipment`, accessToken)),
        getAccountCharacterInventory: (accessToken: string, characterName: string): Promise<ICharacterInventory> =>
            officialApiRawCacher(getOApiUrl(`/characters/${characterName}/inventory`, accessToken)),
        getAccountCharacters: (accessToken: string): Promise<string[]> =>
            officialApiRawCacher(getOApiUrl("/characters", accessToken)),
        getAccountMaterials: (accessToken: string): Promise<IMaterial[]> =>
            officialApiRawCacher(getOApiUrl("/account/materials", accessToken)),
        getAccountWallet: (accessToken: string): Promise<IWalletEntry[]> =>
            officialApiRawCacher(getOApiUrl("/account/wallet", accessToken)),
        getCommercePrice: (id: number) =>
            officialApiBundleCacher(["/commerce/prices", id]),
        getCurrenciesIds: (): Promise<number[]> =>
            officialApiRawCacher(getOApiUrl("/currencies")),
        getCurrency: (id: number): Promise<ICurrency> =>
            officialApiBundleCacher(["/currencies", id]),
        getItem: (id: number): Promise<IItem> =>
            officialApiBundleCacher(["/items", id]),
        getRecipesFromOutput: (outputId: number) =>
            officialApiRawCacher(getOApiUrl(`/recipes/search?output=${outputId}`))
                .then((ids: number[]) =>
                    ids && ids.length > 0 ?
                        Promise.all(ids.map((id) =>
                            (officialApiBundleCacher(["/recipes", id]) as Promise<IOfficialApiRecipe>)
                                .then(officialApiRecipeConverter))) :
                        (mysticApiBundleCacher(["/recipes", outputId]) as Promise<IMysticApiRecipe[]>)
                            .then((recipes) => recipes.map(mysticApiRecipeConverter))),
        getTokenInfo: (accessToken: string): Promise<TokenInfoPermission> =>
            officialApiRawCacher(getOApiUrl("/tokeninfo", accessToken)),
    };

    const mysticApiRecipeConverter = (r: IMysticApiRecipe): IRecipe => ({
        ingredients: r.ingredients,
        prerequisites: r.prerequisites,
        results: r.results,
        type: r.type,
    });

    const officialApiRecipeConverter = (r: IOfficialApiRecipe): IRecipe => {
        return ({
            ingredients: r.ingredients.map((oIngredient) => ({
                amount: oIngredient.count,
                id: oIngredient.item_id,
            })),
            prerequisites: r.disciplines.length > 0 ?
                [{ disciplines: r.disciplines, rating: r.min_rating }] :
                [],
            results: [{
                amount: r.output_item_count,
                id: r.output_item_id,
            }],
            type: "Crafting",
        });
    };

    return api;
};

export default getApi;
