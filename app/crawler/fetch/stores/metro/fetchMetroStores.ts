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
		return {
			message: `chain_name is required, please provide a store name as /stores/:store_name/:chain_name`,
			data: Object.values(MetroChain),
			code: 400,
		};
	}

	const stores = await getMetroStores({
		chainName,
	});

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

export default fetchMetroStores;
