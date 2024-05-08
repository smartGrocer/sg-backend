// eslint-disable-next-line import/no-cycle
import { AllStoreChainBrands, IAllStoreChains } from "./store";

export interface ISearchStore {
	search_term: string;
	store_num: string;
}

export interface IGetProduct {
	product_num: string;
	store_num: string;
}

export interface IProduct {
	product_num: string;
	store_num: string;
	chain_brand: AllStoreChainBrands;
	chain_name: string;
	product_brand: string;
	product_name: string;
	product_link: string;
	product_image: string;
	description: string;
	product_size_unit: string;
	product_size_quantity: number;
	unit_soldby_type: string;
	unit_soldby_unit: string;
}
export interface IPrice {
	price: number;
	price_unit: string;
	price_was: number | null;
	price_was_unit: string | null;
	compare_price: number | null;
	compare_price_unit: string | null;
	compare_price_quantity: number | null;
}
export interface IProductProps extends IProduct, IPrice {}

export interface ISearchProducts {
	search_term: string;
	chainName: IAllStoreChains;
	store_num: string;
}

export interface IGetProductProps {
	url?: string;
	product_num?: string;
	store_num: string;
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
export interface ISearchReturn {
	message: string;
	count?: number;
	data?: IProductProps[] | IProductPropsWithPagination;
	code: number;
	availableOptions?: string | string[];
}

export interface IGetProductReturn {
	message: string;
	data?: IProductProps | IProductProps[];
	code: number;
	availableOptions?: string | string[];
}

// eslint-disable-next-line no-shadow
export enum PandaBrowserKeys {
	metro_search_panda = "metro_search_panda",
	metro_lookup_panda = "metro_lookup_panda",
	metro_crawl_panda = "metro_crawl_panda",
}

export interface IPriceData extends IPrice {
	productId: number;
	storeId: number;
	chain_brand: AllStoreChainBrands;
}

export interface IProductData {
	// storeId: number;
	product_num: string;
	chain_brand: AllStoreChainBrands;
	product_brand: string;
	product_name: string;
	product_link: string;
	product_image: string;
	description: string;
	// product_size_unit: string;
	// product_size_quantity: number;
	// unit_soldby_type: string;
	// unit_soldby_unit: string;
}
