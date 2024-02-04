import { Request, Response } from "express";
import { TValidPostalCode } from "../../../../common/helpers/validatePostalCode";
import { LoblawsChainName } from "../../../../common/types/loblaws/loblaws";
import getLoblawsStores from "./getStore";

interface IFetchLoblawsStores {
	req: Request;
	res: Response;
	validPostalCode: TValidPostalCode;
}

const fetchLoblawsStores = async ({
	req,
	res,
	validPostalCode,
}: IFetchLoblawsStores) => {
	// chain name
	const chainName = req.params.chain as LoblawsChainName;

	if (!chainName) {
		return res.status(400).json({
			message:
				"chain_name is required, please provide a store name as /stores/:store_name/:chain_name",
			availableOptions: Object.values(LoblawsChainName),
		});
	}

	// chain name has to be in the enum
	if (!Object.values(LoblawsChainName).includes(chainName)) {
		return res.status(400).json({
			message:
				"Invalid chain name, please provide a valid chain name. Pick a valid chain name",
			availableOptions: Object.values(LoblawsChainName),
		});
	}

	// get stores
	const stores = await getLoblawsStores({ chainName });

	if (stores instanceof Error) {
		return res.status(500).json({
			message: stores.message,
		});
	}

	return res.status(200).json({
		message: `Stores fetched successfully for ${chainName}`,
		data: stores,
	});
};

export default fetchLoblawsStores;
