import { Request, Response } from "express";
import { IPostalData } from "../../helpers/getPostalCode";
import { TValidPostalCode } from "../../helpers/validatePostalCode";

// eslint-disable-next-line import/no-cycle
import { LoblawsChainName } from "../loblaws/loblaws";
// eslint-disable-next-line import/no-cycle
import { MetroChain } from "../metro/metro";

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

// eslint-disable-next-line no-shadow
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
	userCoordinates: IPostalData;
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

// IAllStoreChains is a union of all the store chains enums like LoblawsChainName, MetroChain, walmart, etc. Need to be able to do Object.values(IAllStoreChains) to get all the chain names
export type IAllStoreChains = LoblawsChainName | MetroChain | "walmart";
