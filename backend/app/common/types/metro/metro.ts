// eslint-disable-next-line import/no-cycle
import { IGetProduct, IGetProductProps, ISearchStore } from "../common/product";

// eslint-disable-next-line no-shadow
export enum MetroFlags {
	metro = "metro",
	foodbasics = "foodbasics",
}

export interface ISearchMetro extends ISearchStore {
	chainName: MetroFlags;
}

export interface IGetProductMetro extends IGetProduct {
	url: string;
	chainName: MetroFlags;
}

export interface IGetProductMetroProps extends IGetProductProps {
	chainName: MetroFlags;
}
