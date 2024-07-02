import { Request, Response } from "express";
import logger from "../../common/logging/logger";
import Product from "../../common/db/schema/product";
import { IProductData } from "../../common/types/common/product";

const getAllProducts = async (req: Request, res: Response) => {
	try {
		const perPage = Number(req.query.per_page) || 10;
		const page = Number(req.query.page) || 1;

		if (perPage < 1 || page < 1) {
			return res.status(400).json({
				message:
					"Invalid per_page or page query parameter. Please provide a valid number greater than 0.",
			});
		}

		if (perPage > 100) {
			return res.status(400).json({
				message:
					"Invalid per_page query parameter. Please provide a valid number less than or equal to 100.",
			});
		}

		const products = (await Product.aggregate([
			{ $skip: perPage * (page - 1) },
			{ $limit: perPage },
			{
				// remove _id and __v from the response
				$project: {
					_id: 0,
					__v: 0,
				},
			},
		])) as IProductData[];

		if (products.length === 0) {
			return res.status(404).json({
				message: "No products found",
			});
		}

		// get the total number of products
		const totalProducts = await Product.countDocuments();

		return res.status(200).json({
			pagination: {
				totalResults: totalProducts,
				count: products.length,
				pageNumber: page,
				pageSize: perPage,
				totalPages: Math.ceil(totalProducts / perPage),
			},
			products,
		});
	} catch (error) {
		logger.error(error);
		return res.status(500).json({
			message: "An error occurred while fetching products",
		});
	}
};

export default getAllProducts;
