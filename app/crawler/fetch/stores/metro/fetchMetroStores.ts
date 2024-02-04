import { Request, Response } from "express";
import { TValidPostalCode } from "../../../../common/helpers/validatePostalCode";
import getMetroStores from "./getStore";
import { MetroChain } from "../../../../common/types/metro/metro";

interface IFetchFoodBasicStores {
	req: Request;
	res: Response;
	validPostalCode: TValidPostalCode;
}

const fetchMetroStores = async ({
	req,
	res,
	validPostalCode,
}: IFetchFoodBasicStores) => {
	const chainName = req.params.chain as MetroChain;

	if (!chainName) {
		return res.status(400).json({
			message: `chain_name is required, please provide a store name as /stores/:store_name/:chain_name`,
			availableChains: Object.values(MetroChain),
		});
	}

	// if chain name is not valid
	if (!Object.values(MetroChain).includes(chainName)) {
		return res.status(400).json({
			message: `Invalid chain name, please provide a valid chain name.`,
			availableChains: Object.values(MetroChain),
		});
	}

	const stores = await getMetroStores({
		chainName,
	});

	if (stores instanceof Error) {
		return res.status(500).json({
			message: stores.message,
			
		});
	}

	return res.status(200).json({
		message: `Stores fetched successfully for ${chainName}`,
		count: stores.length,
		data: stores,
	});
};

export default fetchMetroStores;
