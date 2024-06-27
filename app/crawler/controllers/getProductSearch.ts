import { Request, Response } from "express";
import { LoblawsChainName } from "../../common/types/loblaws/loblaws";
import { MetroChain } from "../../common/types/metro/metro";
import searchLoblaws from "../fetch/search/loblaws/searchLoblaws";
import searchMetro from "../fetch/search/metro/searchMetro";

const getProductSearch = async (req: Request, res: Response) => {
	const search_term = req.params.product_search;
	const chainName = req.query.chain as
		| LoblawsChainName
		| MetroChain
		| "walmart";
	const store_num = req.query.store_num as string;

	if (!search_term) {
		return res.status(400).json({
			message: `Search term is required, please provide a search term as a query parameter like so: /search/:product_search?chain=chain_name`,
			availableOptions: [
				`/search/:product_search`,
				`/search/eggs`,
				"/search/milk",
			],
		});
	}

	if (
		Object.values(LoblawsChainName).includes(chainName as LoblawsChainName)
	) {
		const { message, data, code, availableOptions, count } =
			await searchLoblaws({
				search_term,
				chainName: chainName as LoblawsChainName,
				store_num,
			});

		return res.status(code).json({
			message,
			availableOptions,
			count,
			data,
		});
	}

	if (Object.values(MetroChain).includes(chainName as MetroChain)) {
		const { message, data, code, availableOptions, count } =
			await searchMetro({
				search_term,
				chainName: chainName as MetroChain,
				store_num,
			});

		return res.status(code).json({
			message,
			availableOptions,
			count,
			data,
		});
	}

	return res.status(400).json({
		message: `Invalid chain name, please provide a valid chain name as a query parameter like so: /search/:product_search?chain=chain_name`,
		availableOptions: [
			...Object.values(LoblawsChainName),
			...Object.values(MetroChain),
			"walmart",
		],
	});
};

export default getProductSearch;
