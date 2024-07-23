// eslint-disable-next-line import/no-cycle
import { LoblawsFlagName } from "../../../../common/types/loblaws/loblaws";
import getLoblawsStores from "./getStore";
import filterStoresByLocation from "../../../../common/helpers/filterStoresByLocation";
import {
	IFetchStores,
	IFetchStoresReturn,
} from "../../../../common/types/common/store";
import { writeStoreToDb } from "../../../../common/db/writeToDB";

interface IFetchLoblawsStores extends IFetchStores {}

const fetchLoblawsStores = async ({
	req,
	userCoordinates,
	distance,
	showAllStores,
}: IFetchLoblawsStores): Promise<IFetchStoresReturn> => {
	// chain name
	const flagName = req.params.chain as LoblawsFlagName;

	if (!flagName && !showAllStores) {
		return {
			message:
				"flag_name is required, please provide a store name as /stores/:store_name/:flag_name",
			availableOptions: Object.values(LoblawsFlagName),
			code: 400,
		};
	}

	// chain name has to be in the enum
	if (!Object.values(LoblawsFlagName).includes(flagName) && !showAllStores) {
		return {
			message:
				"Invalid chain name, please provide a valid chain name. Pick a valid chain name",
			availableOptions: Object.values(LoblawsFlagName) as string[],
			code: 400,
		};
	}

	// get stores
	const stores = await getLoblawsStores({ flagName, showAllStores });

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

export default fetchLoblawsStores;
