import { Request, Response } from "express";

const fallBackRoute = async (req: Request, res: Response) => {
	res.json({
		message:
			"Welcome to the Crawler Service. Please use one of the available routes",
		availableRoutes: {
			stores: "/stores/:chain_brand/:chain?postal_code=postal_code&distance=5000",
			product_search:
				"/product/search/:product_search?chain=chain_name&store_num=1234",
			product_lookup:
				"/product/lookup?product_num=1234&url=www.example.com/product/id/1234&chain=chain_name",
			scrape: "/scrape?chain=chain_name",
			all_products: "/products/all?per_page=10&page=1",
		},
	});
};

export default fallBackRoute;
