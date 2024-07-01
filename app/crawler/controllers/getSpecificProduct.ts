import { Request, Response } from "express";
import logger from "../../common/logging/logger";
import Product from "../../common/db/schema/product";

const getProductWithPrices = async (productId: string) => {
	const productWithPrices = await Product.aggregate([
		{
			$match: {
				product_num: productId,
			},
		},
		{
			$lookup: {
				from: "prices",
				localField: "product_num",
				foreignField: "product_num",
				as: "priceHistory",
			},
		},
		{
			$unwind: {
				path: "$priceHistory",
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$lookup: {
				from: "stores",
				localField: "priceHistory.store_num",
				foreignField: "store_num",
				as: "priceHistory.store",
			},
		},
		{
			$unwind: {
				path: "$priceHistory.store",
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$group: {
				_id: "$_id",
				product_num: { $first: "$product_num" },
				chain_brand: { $first: "$chain_brand" },
				product_brand: { $first: "$product_brand" },
				product_name: { $first: "$product_name" },
				product_link: { $first: "$product_link" },
				product_image: { $first: "$product_image" },
				description: { $first: "$description" },
				createdAt: { $first: "$createdAt" },
				updatedAt: { $first: "$updatedAt" },
				priceHistory: {
					$push: {
						product_num: "$priceHistory.product_num",
						store_num: "$priceHistory.store_num",
						history: {
							$map: {
								input: "$priceHistory.history",
								as: "hist",
								in: {
									$arrayToObject: [
										[
											{
												k: {
													$dateToString: {
														format: "%Y-%m-%dT%H:%M:%S.%LZ",
														date: "$$hist.date",
														timezone: "UTC",
													},
												},
												v: "$$hist.amount",
											},
										],
									],
								},
							},
						},
						store: {
							chain_name: "$priceHistory.store.chain_name",
							store_num: "$priceHistory.store.store_num",
							formatted_address:
								"$priceHistory.store.formatted_address",
							latitude: "$priceHistory.store.latitude",
							longitude: "$priceHistory.store.longitude",
							store_name: "$priceHistory.store.store_name",
						},
					},
				},
			},
		},
		{
			$project: {
				_id: 0,
				product_num: 1,
				chain_brand: 1,
				product_brand: 1,
				product_name: 1,
				product_link: 1,
				product_image: 1,
				description: 1,
				createdAt: 1,
				updatedAt: 1,
				priceHistory: {
					$map: {
						input: "$priceHistory",
						as: "price",
						in: {
							store_num: "$$price.store_num",
							store: {
								chain_name: "$$price.store.chain_name",
								store_num: "$$price.store.store_num",
								formatted_address:
									"$$price.store.formatted_address",
								latitude: "$$price.store.latitude",
								longitude: "$$price.store.longitude",
								store_name: "$$price.store.store_name",
							},
							history: "$$price.history",
						},
					},
				},
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

		return res.status(200).json({
			product: productWithPrice[0],
		});
	} catch (error) {
		logger.error(error);
		return res.status(500).json({
			message: "An error occurred while fetching product",
		});
	}
};

export default getSpecificProduct;
