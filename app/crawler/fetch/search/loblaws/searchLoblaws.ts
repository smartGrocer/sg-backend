import {
	ISearchLoblaws,
	ISearchLoblawsReturn,
} from "../../../../common/types/common/product";
import { IStoreProps } from "../../../../common/types/common/store";
import { LoblawsChainName } from "../../../../common/types/loblaws/loblaws";
import getLoblawsStores from "../../stores/loblaws/getStore";
import searchProducts from "./searchProducts";

const searchLoblaws = async ({
	search_term,
	chainName,
	store_id,
}: ISearchLoblaws): Promise<ISearchLoblawsReturn> => {
	if (
		!Object.values(LoblawsChainName).includes(chainName as LoblawsChainName)
	) {
		return {
			message: `Invalid chain name, please provide a valid chain name as a query parameter like so: /search/:product_search?chain=chain_name`,
			availableOptions: Object.values(LoblawsChainName),
			code: 400,
		};
	}

	if (!store_id) {
		const stores = await getLoblawsStores({
			chainName,
			showAllStores: false,
		});

		if (stores instanceof Error) {
			return {
				message: stores.message,
				code: 500,
			};
		}

		return {
			message: `Store ID is required as a query parameter like so: /search/:product_search?store_id=1234`,
			availableOptions: [
				// remove duplicates
				...new Set<string>(
					stores.map((store: IStoreProps) => store.store_id).sort()
				),
			],
			code: 400,
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
