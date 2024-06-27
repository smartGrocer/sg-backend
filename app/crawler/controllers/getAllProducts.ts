import { Request, Response } from "express";
import logger from "../../common/logging/logger";
import Product from "../../common/db/schema/product";
import { IAllProductsData } from "../../common/types/common/product";

const getAllProducts = async (
	req: Request,
	res: Response
): Promise<Response<IAllProductsData> | Response<string>> => {
	try {
		const perPage = Number(req.query.per_page) || 10;
		const page = Number(req.query.page) || 1;

		if (perPage < 1 || page < 1) {
			return res.status(400).json({
				message:
					"Invalid per_page or page query parameter. Please provide a valid number greater than 0.",
				code: 400,
			});
		}

		if (perPage > 100) {
			return res.status(400).json({
				message:
					"Invalid per_page query parameter. Please provide a valid number less than or equal to 100.",
				code: 400,
			});
		}

		const products = await Product.find()
			.skip(perPage * page - perPage)
			.limit(perPage);

		return res.status(200).json({
			pagination: {
				totalResults: products.length,
				pageNumber: page,
				pageSize: perPage,
				totalPages: Math.ceil(products.length / perPage),
			},
			products,
		});
	} catch (error) {
		logger.error(error);
		return res.status(500).send("Internal Server Error");
	}
};

export default getAllProducts;
