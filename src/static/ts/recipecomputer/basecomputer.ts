import { IAchievementPrerequisite, ICraftingPrerequisite, IRecipe } from "../api";
import { getFromMapNum, getFromMapStr } from "./mapoperations";

export interface IBaseComputerNode {
    neededAmount: number;
    ownedAmount: number;
}

export interface IBaseComputerItemNode extends IBaseComputerNode {
    itemId: number;
    recipes: IBaseComputerNodeRecipe[];
}

export function isBaseComputerItemNode(
    n: IBaseComputerItemNode | IBaseComputerCurrencyNode | IBaseComputerAchievementNode):
    n is IBaseComputerItemNode {
    throw new Error("NotImplemented");
}

export interface IBaseComputerNodeRecipe {
    amount: number;
    type: "MysticForge" | "Salvage" | "Vendor" | "Charge" | "DoubleClick" | "Achievement" | "Crafting";
    ingredients: Array<IBaseComputerItemNode | IBaseComputerCurrencyNode | IBaseComputerAchievementNode>;
    results: IBaseComputerNode[];
    prerequisites: Array<IAchievementPrerequisite | ICraftingPrerequisite>;
}

export interface IBaseComputerCurrencyNode extends IBaseComputerNode {
    currencyName: string;
}

export interface IBaseComputerAchievementNode extends IBaseComputerNode {
    achievementId: number;
}

const computer = (
    rootItemId: number,
    getRecipes: (outputId: number) => Promise<IRecipe[]>,
    ownedItems: { [id: number]: number },
    ownedCurrencies: { [name: string]: number },
): Promise<IBaseComputerItemNode> => {
    /*const innerComputer = (itemId: number, amount: number) => {
        const currentlyOwnedAmount = getFromMapNum(ownedItems, itemId);
        const usedAmount = Math.min(amount, currentlyOwnedAmount);
        const newOwnedItems = removeFromMapNum(ownedItems, itemId, usedAmount);
        if(currentlyOwnedAmount >= amount) {
        }
    };

    return innerComputer(rootItemId, 1);*/
    throw new Error("NotImplemented");
};

export default computer;
