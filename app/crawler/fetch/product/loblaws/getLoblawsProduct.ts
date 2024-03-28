import { IGetProductReturn } from "../../../../common/types/common/product";
import {
	IGetProductLoblaws,
	LoblawsChainName,
	validateLoblawsStoreId,
} from "../../../../common/types/loblaws/loblaws";
import getProduct from "./getProduct";

const getLoblawsProduct = async ({
	product_id,
	chainName,
	store_id,
}: IGetProductLoblaws): Promise<IGetProductReturn> => {
	if (
		!Object.values(LoblawsChainName).includes(chainName as LoblawsChainName)
	) {
		return {
			message: `Invalid chain name, please provide a valid chain name as a query parameter like so: /product/lookup&chain=chain_name`,
			availableOptions: Object.values(LoblawsChainName),
			code: 400,
		};
	}

	const { message, code, availableOptions } = await validateLoblawsStoreId({
		storeId: store_id,
		chainName,
	});

	if (code !== 200) {
		return {
			message,
			availableOptions,
			code,
		};
	}

	const response = await getProduct({
		product_id,
		store_id,
		chainName: chainName as LoblawsChainName,
	});

	// if error
	if (response instanceof Error) {
		// if 404
		if (response.message === "Request failed with status code 404") {
			return {
				message: `Product not found for product id: ${product_id}`,
				code: 404,
			};
		}

		return {
			message: response.message,
			code: 500,
		};
	}

	return {
		message: `Product fetched successfully for product id: ${product_id}`,
		data: response,
		code: 200,
	};
};

export default getLoblawsProduct;
