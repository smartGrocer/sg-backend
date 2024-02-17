import { ISearchStore } from "../common/product";

export enum MetroChain {
	metro = "metro",
	foodbasics = "foodbasics",
}

export interface ISearchMetro extends ISearchStore {
	chainName: MetroChain;
}
