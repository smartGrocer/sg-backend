import { Request, Response } from "express";
// eslint-disable-next-line import/no-cycle
import { IPostalData } from "../../helpers/getCoordinatesFromPostal";
import { TValidPostalCode } from "../../helpers/validatePostalCode";

// eslint-disable-next-line import/no-cycle
import { LoblawsFlagName } from "../loblaws/loblaws";
// eslint-disable-next-line import/no-cycle
import { MetroFlags } from "../metro/metro";

// eslint-disable-next-line no-shadow
export enum AllParentCompanyList {
	all = "all",
	loblaws = "loblaws",
	walmart = "walmart",
	metro = "metro",
	foodbasics = "foodbasics",
}
export interface IStoreProps {
	// id: string;
	store_num: string;
	parent_company: AllParentCompanyList;
	flag_name: string;
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

// IAllStoreFlags is a union of all the store flags enums like LoblawsFlagName, MetroFlags, walmart, etc. Need to be able to do Object.values(IAllStoreFlags) to get all the flag names
export type IAllStoreFlags = LoblawsFlagName | MetroFlags | "walmart";
