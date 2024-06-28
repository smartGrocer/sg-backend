import { Request, Response } from "express";
import logger from "../../common/logging/logger";
import Product from "../../common/db/schema/product";
import cleanMongoDoc from "../../common/helpers/cleanMongoDoc";
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

		const products = await Product.find()
			.skip(perPage * page - perPage)
			.limit(perPage);

		if (products.length === 0) {
			return res.status(404).json({
				message: "No products found",
			});
		}

		const cleanedProducts = products.map((product) =>
			cleanMongoDoc({
				doc: product,
				keysToRemove: ["_id", "__v"],
			})
		) as IProductData[];

		// get the total number of products
		const totalProducts = await Product.countDocuments();

		return res.status(200).json({
			pagination: {
				totalResults: totalProducts,
				count: cleanedProducts.length,
				pageNumber: page,
				pageSize: perPage,
				totalPages: Math.ceil(totalProducts / perPage),
			},
			products: cleanedProducts,
		});
	} catch (error) {
		logger.error(error);
		return res.status(500).json({
			message: "An error occurred while fetching products",
		});
	}
};

export default getAllProducts;
