import { Request, Response } from "express";
import getWalmartStores from "./getStore";
import { TValidPostalCode } from "../../../../common/helpers/validatePostalCode";

interface IFetchWalmartStores {
	req: Request;
	res: Response;
	validPostalCode: TValidPostalCode;
}

const fetchWalmartStores = async ({
	req,
	res,
	validPostalCode,
}: IFetchWalmartStores) => {
	if (!validPostalCode) {
		return res.status(400).json({
			message: `Invalid postal code, please provide a valid postal code.`,
			availableParams: "postal_code",
		});
	}

	const stores = await getWalmartStores({
		validPostalCode,
	});

	if (stores instanceof Error) {
		return res.status(500).json({
			message: stores.message,
			
		});
	}

	return res.status(200).json({
		message: `Stores fetched successfully for walmart`,
		count: stores.length,
		data: stores,
	});
};

export default fetchWalmartStores;
