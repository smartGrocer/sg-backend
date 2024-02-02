import { LoblawsChainName } from "../../../../common/types/loblaws/loblaws";
import getLoblawsStores from "./getStore";

const fetchLoblawsStores = async (req: any, res: any) => {
	// chain name
	const chainName = req.params.chain as LoblawsChainName;

	if (!chainName) {
		return {
			message:
				"Store_name is required, please provide a store name as /stores/:store_name",
			data: Object.values(LoblawsChainName),
			code: 400,
		};
	}

	// chain name has to be in the enum
	if (!Object.values(LoblawsChainName).includes(chainName)) {
		return {
			message:
				"Invalid chain name, please provide a valid chain name. Pick a valid chain name",
			data: Object.values(LoblawsChainName),
			code: 400,
		};
	}

	// get stores
	const stores = await getLoblawsStores({ chainName });

	if (stores instanceof Error) {
		return {
			message: stores.message,
			data: null,
			code: 500,
		};
	}

	return {
		message: `Stores fetched successfully for ${chainName}`,
		data: stores,
		code: 200,
	};
};

export default fetchLoblawsStores;
