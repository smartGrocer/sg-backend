// eslint-disable-next-line import/no-cycle
import { IGetProduct, IGetProductProps, ISearchStore } from "../common/product";

// eslint-disable-next-line no-shadow
export enum MetroChain {
	metro = "metro",
	foodbasics = "foodbasics",
}

export interface ISearchMetro extends ISearchStore {
	chainName: MetroChain;
}

export interface IGetProductMetro extends IGetProduct {
	url: string;
	chainName: MetroChain;
}

export interface IGetProductMetroProps extends IGetProductProps {
	chainName: MetroChain;
}
