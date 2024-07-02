import { Request, Response } from "express";
import logger from "../../common/logging/logger";
import getProductWithPrices from "../../common/helpers/getProductWithPrices";

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
