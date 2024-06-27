import { Request, Response } from "express";
import { LoblawsChainName } from "../../common/types/loblaws/loblaws";
import { MetroChain } from "../../common/types/metro/metro";
import getLoblawsProduct from "../fetch/product/loblaws/getLoblawsProduct";
import getMetroProduct from "../fetch/product/metro/getMetroProduct";

const getProductLookup = async (req: Request, res: Response) => {
	const product_num = req.query.product_num as string;
	const link_to_product = req.query.url as string;
	const chainName = req.query.chain as
		| LoblawsChainName
		| MetroChain
		| "walmart";
	const store_num = req.query.store_num as string;

	if (!product_num && !link_to_product) {
		return res.status(400).json({
			message: `Either product_num or url is required as a query param, please provide one like so: /product/lookup?product_num=1234&url=www.example.com/product/id/1234`,
			availableOptions: [
				"/product/lookup?product_num=1234",
				"/product/lookup?url=www.example.com/product/id/1234",
				"/product/lookup?product_num=1234&url=www.example.com/product/id/1234",
				"/product/lookup?product_num=1234&chain=chain_name",
				"/product/lookup?url=www.example.com/product/id/1234&chain=chain_name",
			],
		});
	}

	if (
		Object.values(LoblawsChainName).includes(chainName as LoblawsChainName)
	) {
		const { message, data, code, availableOptions } =
			await getLoblawsProduct({
				product_num,
				store_num,
				chainName: chainName as LoblawsChainName,
			});

		return res.status(code).json({
			message,
			availableOptions,
			data,
		});
	}

	if (Object.values(MetroChain).includes(chainName as MetroChain)) {
		const { message, data, code, availableOptions } = await getMetroProduct(
			{
				product_num,
				url: link_to_product,
				chainName: chainName as MetroChain,
				store_num,
			}
		);

		return res.status(code).json({
			message,
			availableOptions,
			data,
		});
	}

	return res.status(400).json({
		message: `Invalid chain name, please provide a valid chain name as a query parameter like so: /product/id/:product_num?chain=chain_name`,
		availableOptions: [
			...Object.values(LoblawsChainName),
			...Object.values(MetroChain),
			"walmart",
		],
	});
};

export default getProductLookup;
