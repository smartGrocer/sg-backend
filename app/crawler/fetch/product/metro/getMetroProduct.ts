// eslint-disable-next-line import/no-cycle
import { IGetProductReturn } from "../../../../common/types/common/product";
import {
	IGetProductMetro,
	MetroChain,
} from "../../../../common/types/metro/metro";
import getProduct from "./getProduct";

const getMetroProduct = async ({
	product_id,
	url,
	chainName,
	store_id,
}: IGetProductMetro): Promise<IGetProductReturn> => {
	if (!Object.values(MetroChain).includes(chainName as MetroChain)) {
		return {
			message: `Invalid chain name, please provide a valid chain name as a query parameter like so: /product/lookup&chain=chain_name`,
			availableOptions: Object.values(MetroChain),
			code: 400,
		};
	}

	if (!url) {
		return {
			message: `Invalid url, please provide a valid url as a query parameter like so: /product/lookup?url=url`,
			availableOptions: [
				"/product/lookup?url=url",
				"/product/lookup?product_id=product_id",
				"/product/lookup?product_id=product_id&chain=chain_name",
				"/product/lookup?url=https://www.metro.ca/en/online-grocery/aisles/meat-fish/poultry/chicken-thighs-drumsticks/00007",
			],
			code: 400,
		};
	}

	const response = await getProduct({
		product_id,
		url,
		store_id,
		chainName: chainName as MetroChain,
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
		message: `Product fetched successfully for product id: ${product_id || url}`,
		data: response,
		code: 200,
	};
};

export default getMetroProduct;
