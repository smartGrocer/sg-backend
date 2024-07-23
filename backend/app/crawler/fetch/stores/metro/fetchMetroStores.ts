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
	const flagName = req.params.flag as MetroFlags;
	if (!flagName && !showAllStores) {
		return {
			message: `flag_name is required, please provide a store name as /stores/:parent_name/:flag_name`,
			availableOptions: Object.values(MetroFlags),
			code: 400,
		};
	}
	// if flag name is not valid
	if (!Object.values(MetroFlags).includes(flagName) && !showAllStores) {
		return {
			message: `Invalid flag name, please provide a valid flag name.`,
			availableOptions: Object.values(MetroFlags),
			code: 400,
		};
	}

	// TODO: add getting metro and foodbasics stores when showAllStores is true
	const stores = await getMetroStores({
		flagName,
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
		message: `Stores fetched successfully for ${flagName}`,
		count: filteredStores.length,
		data: filteredStores,
		code: 200,
	};
};

export default fetchMetroStores;
