import { Request, Response } from "express";

const fallBackRoute = async (_req: Request, res: Response) => {
	res.json({
		message:
			"Welcome to the Crawler Service. Please use one of the available routes",
		availableRoutes: {
			stores: "/api/stores/:parent_company/:chain?postal_code=postal_code&distance=5000",
			scrape: "/api/scrape?chain=chain_name",
			all_products: "/api/products/all?per_page=10&page=1",
			product: "/api/product/:id",
		},
	});
};

export default fallBackRoute;
