import { ISearchReturn } from "../../../../common/types/common/product";
import {
	ISearchLoblaws,
	LoblawsChainName,
	validateLoblawsStoreId,
} from "../../../../common/types/loblaws/loblaws";
import searchProducts from "./searchProducts";

const searchLoblaws = async ({
	search_term,
	chainName,
	store_id,
}: ISearchLoblaws): Promise<ISearchReturn> => {
	if (
		!Object.values(LoblawsChainName).includes(chainName as LoblawsChainName)
	) {
		return {
			message: `Invalid chain name, please provide a valid chain name as a query parameter like so: /search/:product_search?chain=chain_name`,
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

	const response = await searchProducts({
		search_term,
		chainName: chainName as LoblawsChainName,
		store_id,
	});

	// if error
	if (response instanceof Error) {
		return {
			message: response.message,
			code: 500,
		};
	}

	return {
		message: `Products fetched successfully for search term: ${search_term}`,
		data: response,
		count: response.results.length,
		code: 200,
	};
};

export default searchLoblaws;
