import { IAllStoreChains } from "./store";

export interface IProductPropsWithPagination {
	results: IProductProps[];
	pagination: {
		totalResults: number;
		pageNumber: number;
		pageSize: number;
		totalPages: number;
	};
}

export interface ISearchStore {
	search_term: string;
	store_id: string;
}
export interface ISearchReturn {
	message: string;
	count?: number;
	data?: IProductProps[];
	code: number;
	availableOptions?: string | string[];
}

export interface IProductProps {
	product_id: string;
	store_id: string;
	chainName: string;
	product_brand: string;
	product_name: string;
	product_link: string;
	product_image: string;
	product_size_unit: string;
	product_size_quantity: number;
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
