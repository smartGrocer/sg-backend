import { Request, Response } from "express";
import logger from "../../common/logging/logger";
import Product from "../../common/db/schema/product";
// import Price from "../../common/db/schema/price";
// import { IProductData } from "../../common/types/common/product";
// import cleanMongoDoc from "../../common/helpers/cleanMongoDoc";

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

		const productWithPrice = await getProductWithPrices(productId);

		if (!productWithPrice.length) {
			return res.status(404).json({
				message: "Product not found",
			});
		}

		// const cleanedProduct = product.map((doc) =>
		// 	cleanMongoDoc(doc)
		// ) as IProductData[];

		return res.status(200).json({
			product: productWithPrice,
		});
	} catch (error) {
		logger.error(error);
		return res.status(500).json({
			message: "An error occurred while fetching product",
		});
	}
};

export default getSpecificProduct;
