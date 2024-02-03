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
	loblaws = "loblaws",
	walmart = "walmart",
	metro = "metro",
}
