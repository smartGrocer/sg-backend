// eslint-disable-next-line import/no-cycle
import { LoblawsChainName } from "../../../../common/types/loblaws/loblaws";
import getLoblawsStores from "./getStore";
import filterStoresByLocation from "../../../../common/helpers/filterStoresByLocation";
import {
	IFetchStores,
	IFetchStoresReturn,
} from "../../../../common/types/common/store";

interface IFetchLoblawsStores extends IFetchStores {}

const fetchLoblawsStores = async ({
	req,
	userCoordinates,
	distance,
	showAllStores,
}: IFetchLoblawsStores): Promise<IFetchStoresReturn> => {
	// chain name
	const chainName = req.params.chain as LoblawsChainName;

	if (!chainName && !showAllStores) {
		return {
			message:
				"chain_name is required, please provide a store name as /stores/:store_name/:chain_name",
			availableOptions: Object.values(LoblawsChainName),
			code: 400,
		};
	}

	// chain name has to be in the enum
	if (
		!Object.values(LoblawsChainName).includes(chainName) &&
		!showAllStores
	) {
		return {
			message:
				"Invalid chain name, please provide a valid chain name. Pick a valid chain name",
			availableOptions: Object.values(LoblawsChainName) as string[],
			code: 400,
		};
	}

	// get stores
	const stores = await getLoblawsStores({ chainName, showAllStores });

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

export default fetchLoblawsStores;
