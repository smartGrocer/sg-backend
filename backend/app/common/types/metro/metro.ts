// eslint-disable-next-line import/no-cycle
import { IGetProduct, IGetProductProps } from "../common/product";

// eslint-disable-next-line no-shadow
export enum MetroFlags {
	metro = "metro",
	foodbasics = "foodbasics",
}

export interface IGetProductMetro extends IGetProduct {
	url: string;
	flagName: MetroFlags;
}

export interface IGetProductMetroProps extends IGetProductProps {
	flagName: MetroFlags;
}
