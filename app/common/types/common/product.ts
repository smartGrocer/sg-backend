import { Request, Response } from "express";
import { LoblawsChainName } from "../loblaws/loblaws";
import { MetroChain } from "../metro/metro";
import { IAllStoreChains } from "./store";

export interface ISearchLoblaws {
	req: Request;
	res: Response;
	search_term: string;
	chainName: LoblawsChainName;
	store_id: string;
}

export interface ISearchLoblawsReturn {
	message: string;
	count?: number;
	data?: IProductPropsWithPagination;
	code: number;
	availableOptions?: string | string[];
}

export interface IProductPropsWithPagination {
	results: IProductProps[];
	pagination: {
		totalResults: number;
		pageNumber: number;
		pageSize: number;
		totalPages: number;
	};
}

export interface IProductProps {
	product_id: string;
	store_id: string;
    chainName: string;
	product_brand: string;
	product_name: string;
	product_link: string;
	product_image: string;
	product_size: string;
	unit_soldby_type: string;
	unit_soldby_unit: string;
	price: number;
	price_unit: string;
	price_was: number | null;
	price_was_unit: string | null;
	compare_price: number | null;
	compare_price_unit: string | null;
	compare_price_quantity: number | null;
}

export interface ISearchProducts {
	search_term: string;
	chainName: IAllStoreChains;
	store_id: string;
}
