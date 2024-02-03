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
		return {
			message: `Invalid postal code, please provide a valid postal code.`,
			availableParams: "postal_code",
			code: 400,
		};
	}

	const stores = await getWalmartStores({
		validPostalCode,
	});

	if (stores instanceof Error) {
		return {
			message: stores.message,
			data: null,
			code: 500,
		};
	}

	return {
		message: `Stores fetched successfully for walmart`,
		data: stores,
		code: 200,
	};
};

export default fetchWalmartStores;
