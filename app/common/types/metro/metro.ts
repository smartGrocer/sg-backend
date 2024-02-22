import { IGetProduct, IGetProductProps, ISearchStore } from "../common/product";

export enum MetroChain {
	metro = "metro",
	foodbasics = "foodbasics",
}

export interface ISearchMetro extends ISearchStore {
	chainName: MetroChain;
}

export interface IGetProductMetro extends IGetProduct {
	chainName: MetroChain;
}

export interface IGetProductMetroProps extends IGetProductProps {
	chainName: MetroChain;
}