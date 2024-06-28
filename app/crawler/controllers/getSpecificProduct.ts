import { Request, Response } from "express";

import logger from "../../common/logging/logger";
import Product from "../../common/db/schema/product";
import {
	IPriceHistory,
	IProductDataWithPriceHistory,
} from "../../common/types/common/product";
import cleanMongoDoc from "../../common/helpers/cleanMongoDoc";
import morphPriceHistoryArray from "../../common/helpers/morphPriceHistoryArray";

const cleanProductWithPrices = (
	productWithPrice: IProductDataWithPriceHistory[]
) => {
	const { priceHistory, ...product } =
		productWithPrice[0] as IProductDataWithPriceHistory;

	const cleanedPrices = priceHistory.map((doc) => {
		const cleanedPriceDoc = cleanMongoDoc({
			doc,
			keysToRemove: ["_id", "__v"],
		}) as IPriceHistory;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { history, product_num, ...rest } = cleanedPriceDoc;

		const formattedPriceArray = morphPriceHistoryArray(history);

		const formattedPriceHistory = {
			...rest,
			history: formattedPriceArray,
		};

		return formattedPriceHistory;
	});

	const cleanedProduct = cleanMongoDoc({
		doc: product,
		keysToRemove: ["_id", "__v"],
	});

	const productWithCleanedPrices = {
		...cleanedProduct,
		priceHistory: cleanedPrices,
	};

	return productWithCleanedPrices;
};

const getProductWithPrices = async (productId: string) => {
	const productWithPrices = await Product.aggregate([
		{
			$match: {
				product_num: productId,
			},
		},
		{
			$lookup: {
				from: "prices", // The collection name in MongoDB
				localField: "product_num",
				foreignField: "product_num",
				as: "priceHistory",
			},
		},
	]);

	return productWithPrices;
};

const getSpecificProduct = async (req: Request, res: Response) => {
	try {
		const productId = req.params.id;

		if (!productId) {
			return res.status(400).json({
				message: "product_num is required as `/api/product/:id`",
			});
		}

		const productWithPrice = await getProductWithPrices(productId);

		if (!productWithPrice.length) {
			return res.status(404).json({
				message: "Product not found",
			});
		}

		const cleanedProductWithPrices =
			cleanProductWithPrices(productWithPrice);

		return res.status(200).json({
			product: cleanedProductWithPrices,
		});
	} catch (error) {
		logger.error(error);
		return res.status(500).json({
			message: "An error occurred while fetching product",
		});
	}
};

export default getSpecificProduct;
