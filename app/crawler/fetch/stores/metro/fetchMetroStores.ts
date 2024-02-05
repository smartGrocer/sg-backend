import { Request, Response } from "express";
import { TValidPostalCode } from "../../../../common/helpers/validatePostalCode";
import getMetroStores from "./getStore";
import { MetroChain } from "../../../../common/types/metro/metro";
import { IPostalDataWithDate } from "../../../../common/helpers/getPostalCode";
import filterStoresByLocation from "../../../../common/helpers/filterStoresByLocation";
import {
	IFetchStores,
	IFetchStoresReturn,
} from "../../../../common/types/common/store";

interface IFetchFoodBasicStores extends IFetchStores {}

const fetchMetroStores = async ({
	req,
	userCoordinates,
	distance,
	showAllStores,
}: IFetchFoodBasicStores): Promise<IFetchStoresReturn> => {
	const chainName = req.params.chain as MetroChain;

	if (!chainName) {
		return {
			message: `chain_name is required, please provide a store name as /stores/:store_name/:chain_name`,
			availableOptions: Object.values(MetroChain),
			code: 400,
		};
	}

	// if chain name is not valid
	if (!Object.values(MetroChain).includes(chainName) && !showAllStores) {
		return {
			message: `Invalid chain name, please provide a valid chain name.`,
			availableOptions: Object.values(MetroChain),
			code: 400,
		};
	}

	const stores = await getMetroStores({
		chainName,
	});

	if (stores instanceof Error) {
		return {
			message: stores.message,
			code: 500,
		};
	}

	const filteredStores = showAllStores
		? stores
		: filterStoresByLocation({
				stores,
				distance,
				userCoordinates,
			});

	return {
		message: `Stores fetched successfully for ${chainName}`,
		count: filteredStores.length,
		data: filteredStores,
		code: 200,
	};
};

export default fetchMetroStores;
