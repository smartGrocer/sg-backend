import { Request, Response } from "express";
import axios from "axios";
import logger from "../../common/logging/logger";
import Product from "../../common/db/schema/product";

const catogorizeProduct = async (req: Request, res: Response) => {
	try {
		const productId = req.params.id;

		if (!productId) {
			return res.status(400).json({
				message: "product_num is required as `/api/product/:id`",
			});
		}
		// get product data from db
		const product = await Product.findOne({
			product_num: productId,
		});

		if (!product) {
			return res.status(404).json({
				message: "Product not found",
			});
		}

		const body = {
			model: "llama3-grocer",
			prompt: `Name: ${product.product_name}. Brand: ${product.product_brand} Description: ${product.description}`,
			stream: false,
			format: "json",
		};

		// categorize product
		const postResponse = await axios.post(
			`http://localhost:11434/api/generate`,
			body
		);

		const { data } = postResponse;

		const { response } = data;

		// check if valid json
		if (!response) {
			return res.status(404).json({
				message: "No categories found for the product - 2",
			});
		}

		// convert response to json
		const responseJson = JSON.parse(response);

		return res.status(200).json({
			response: responseJson,
			body,
			data,
		});
	} catch (error) {
		logger.error(error);
		return res.status(500).json({
			message: "An error occurred while categorizing product - 3",
		});
	}
};

export default catogorizeProduct;
