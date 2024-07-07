import { Request, Response } from "express";

const fallBackRoute = async (req: Request, res: Response) => {
	res.json({
		message:
			"Welcome to the Crawler Service. Please use one of the available routes",
		availableRoutes: {
			stores: "/stores/:chain_brand/:chain?postal_code=postal_code&distance=5000",
			scrape: "/scrape?chain=chain_name",
			all_products: "/products/all?per_page=10&page=1",
			product: "/product/:id",
		},
	});
};

export default fallBackRoute;
