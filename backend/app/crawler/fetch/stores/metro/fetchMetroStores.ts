// eslint-disable-next-line import/no-cycle
import getMetroStores from "./getStore";
import { MetroFlags } from "../../../../common/types/metro/metro";
import filterStoresByLocation from "../../../../common/helpers/filterStoresByLocation";
import {
	IFetchStores,
	IFetchStoresReturn,
} from "../../../../common/types/common/store";
import { writeStoreToDb } from "../../../../common/db/writeToDB";

interface IFetchFoodBasicStores extends IFetchStores {}

const fetchMetroStores = async ({
	req,
	userCoordinates,
	distance,
	showAllStores,
}: IFetchFoodBasicStores): Promise<IFetchStoresReturn> => {
	const chainName = req.params.chain as MetroFlags;

	if (!chainName) {
		return {
			message: `chain_name is required, please provide a store name as /stores/:store_name/:chain_name`,
			availableOptions: Object.values(MetroFlags),
			code: 400,
		};
	}

	// if chain name is not valid
	if (!Object.values(MetroFlags).includes(chainName) && !showAllStores) {
		return {
			message: `Invalid chain name, please provide a valid chain name.`,
			availableOptions: Object.values(MetroFlags),
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

	// write stores to db
	await writeStoreToDb(filteredStores);

	return {
		message: `Stores fetched successfully for ${chainName}`,
		count: filteredStores.length,
		data: filteredStores,
		code: 200,
	};
};

export default fetchMetroStores;
