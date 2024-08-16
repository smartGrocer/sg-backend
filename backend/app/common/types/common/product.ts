import { AllParentCompanyList, IAllStoreFlags } from "./store";

export interface IGetProduct {
	product_num: string;
	store_num: string;
}

export interface IProduct {
	product_num: string;
	store_num: string;
	parent_company: AllParentCompanyList;
	flag_name: string;
	product_brand: string;
	product_name: string;
	product_link: string;
	product_image: string;
	description: string;
}
export interface IPrice {
	price: number;
}
export interface IProductProps extends IProduct, IPrice {}

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

export interface IGetProductReturn {
	message: string;
	data?: IProductProps | IProductProps[];
	code: number;
	availableOptions?: string | string[];
}

// eslint-disable-next-line no-shadow
export enum PandaBrowserKeys {
	metro_lookup_panda = "metro_lookup_panda",
	metro_crawl_panda = "metro_crawl_panda",
}

export interface IPriceData extends IPrice {
	productId: number;
	storeId: number;
	parent_company: AllParentCompanyList;
}

export interface IProductData {
	product_num: string;
	parent_company: AllParentCompanyList;
	product_brand: string;
	product_name: string;
	product_link: { [key in IAllStoreFlags]: string };
	product_image: string;
	description: string;
}

export const quant_uom = ["g", "kg", "ml", "l", "unit"];
