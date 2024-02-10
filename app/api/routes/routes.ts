import express, { Request, Response } from "express";
import getSecret from "../../common/helpers/getSecret";
import axios from "axios";

const router = express.Router();
const PORT_CRAWLER = getSecret("PORT_CRAWLER") || 7000;
const CRAWLER_URL = getSecret("CRAWLER_URL") || "";
const domain_port = `${CRAWLER_URL}:${PORT_CRAWLER}`;

// Routes
router.get(
	"/stores/:chain_brand?/:chain?",
	async (req: Request, res: Response) => {
		const request_url = req.url;

		try {
			const built_url = `${domain_port}/api${request_url}`;

			console.log(`TO: ${built_url}`);
			const response = await axios.get(`${built_url}`);

			// @ts-ignore
			res.status(response.status).json(response.data);
		} catch (e: unknown) {
			// @ts-ignore
			res.status(e.response ? e.response.status : 500).json({
				// @ts-ignore
				error: e.response ? e.response.data : e,
			});
		}
	}
);

router.get(
	"/product/search/:product_search?",
	async (req: Request, res: Response) => {
		const request_url = req.url;
		try {
			const built_url = `${domain_port}/api${request_url}`;

			console.log(`TO: ${built_url}`);
			const response = await axios.get(`${built_url}`);

			// @ts-ignore
			res.status(response.status).json(response.data);
		} catch (e: unknown) {
			// @ts-ignore
			res.status(e.response ? e.response.status : 500).json({
				// @ts-ignore
				error: e.response ? e.response.data : e,
			});
		}
	}
);

router.get("*", (req, res) => {
	res.json({
		message:
			"Welcome to the API service. Please use one of the available routes",
		availableRoutes: {
			loblaws: {
				stores: "/stores/:chain_brand/:chain?postal_code=postal_code&distance=5000",
				product_search:
					"/product/search/:product_search?chain=chain_name&store_id=1234",
			},
		},
	});
});

export default router;
