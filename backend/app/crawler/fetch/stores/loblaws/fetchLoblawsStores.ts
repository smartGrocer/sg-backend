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
	// flag name
	const flagName = req.params.flag as LoblawsFlagName;

	if (!flagName && !showAllStores) {
		return {
			message:
				"flag_name is required, please provide a store name as /stores/:parent_name/:flag_name",
			availableOptions: Object.values(LoblawsFlagName),
			code: 400,
		};
	}

	// flag name has to be in the enum
	if (!Object.values(LoblawsFlagName).includes(flagName) && !showAllStores) {
		return {
			message:
				"Invalid flag name, please provide a valid flag name. Pick a valid flag name",
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
