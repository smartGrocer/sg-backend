// eslint-disable-next-line import/no-cycle
import { writeToDb } from "../../../../common/db/writeToDB";
import { ISearchReturn } from "../../../../common/types/common/product";
import { ISearchMetro, MetroChain } from "../../../../common/types/metro/metro";
import searchProducts from "./searchProducts";

const searchMetro = async ({
	search_term,
	chainName,
	store_num,
}: ISearchMetro): Promise<ISearchReturn> => {
	if (!Object.values(MetroChain).includes(chainName as MetroChain)) {
		return {
			message: `Invalid chain name, please provide a valid chain name as a query parameter like so: /search/:product_search?chain=chain_name`,
			availableOptions: Object.values(MetroChain),
			code: 400,
		};
	}

	const response = await searchProducts({
		search_term,
		chainName: chainName as MetroChain,
		store_num,
	});

	// if error
	if (response instanceof Error) {
		return {
			message: response.message,
			code: 500,
		};
	}
	await writeToDb(response);

	return {
		message: `Products fetched successfully for search term: ${search_term}`,
		data: response,
		count: response.length,
		code: 200,
	};
};

export default searchMetro;
