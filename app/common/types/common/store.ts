import { IPostalDataWithDate } from "../../helpers/getPostalCode";
import { TValidPostalCode } from "../../helpers/validatePostalCode";
import { Request, Response } from "express";

export interface IStoreProps {
	id: string;
	store_id: string;
	chain_name: string;
	store_name: string;
	latitude: number;
	longitude: number;
	formatted_address: string;
	city: string;
	line1: string;
	line2: string;
	postal_code: string;
	province: string;
	country: string;
}

export interface IStoreResponse {
	count: number;
	stores: IStoreProps[];
}

export enum AllStoreChainBrands {
	all = "all",
	loblaws = "loblaws",
	walmart = "walmart",
	metro = "metro",
}

export interface IFetchStores {
	req: Request;
	res: Response;
	validPostalCode: TValidPostalCode;
	userCoordinates: IPostalDataWithDate;
	distance: number;
	showAllStores: boolean;
}

export interface IFetchStoresReturn {
	message: string;
	count?: number;
	data?: IStoreProps[];
	code: number;
	availableOptions?: string | string[];
}
