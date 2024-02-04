import express, { Request, Response } from "express";
import fetchLoblawsStores from "../../crawler/fetch/stores/loblaws/fetchLoblawsStores";
import { AllStoreChainBrands } from "../../common/types/common/store";
import fetchMetroStores from "../../crawler/fetch/stores/metro/fetchMetroStores";
import fetchWalmartStores from "../../crawler/fetch/stores/walmart/fetchWalmartStores";
import {
	TValidPostalCode,
	validatePostalCode,
} from "../../common/helpers/validatePostalCode";
import { getCoordinatesFromPostal } from "../../common/helpers/getPostalCode";
const router = express.Router();

// Routes
router.get(
	"/stores/:chain_brand?/:chain?",
	async (req: Request, res: Response) => {
		const params = req.params;
		const chain_brand = params.chain_brand as AllStoreChainBrands;

		const postalCode = req.query.postal_code as string;
		const validPostalCode = validatePostalCode(postalCode);

		if (!validPostalCode) {
			return res.status(400).json({
				message:
					"Invalid postal code. Please provide a valid postal code as a query parameter in the format: ?postal_code=a1a1a1",
			});
		}

		const coordinates = await getCoordinatesFromPostal(postalCode);
		console.log({ coordinates });

		// if chain brand is not provided or is invalid
		if (!Object.values(AllStoreChainBrands).includes(chain_brand)) {
			return res.status(400).json({
				message: `Invalid chain brand, please provide a valid chain brand.`,
				availableChains: Object.values(AllStoreChainBrands),
			});
		}

		// if the chain brand is loblaws
		if (chain_brand === AllStoreChainBrands.loblaws) {
			return await fetchLoblawsStores({
				req,
				res,
				validPostalCode,
			});
		}

		// if the chain brand is metro
		if (chain_brand === AllStoreChainBrands.metro) {
			return await fetchMetroStores({
				req,
				res,
				validPostalCode,
			});
		}

		if (chain_brand === AllStoreChainBrands.walmart) {
			return await fetchWalmartStores({
				req,
				res,
				validPostalCode,
			});
		}

		// if the chain brand is unavailable
		return res.status(400).json({
			message: "Unavailable chain brand. Please try again later.",
		});
	}
);

router.get("*", (req, res) => {
	res.json({
		message:
			"Welcome to the Loblaws API. Please use one of the available routes",
		availableRoutes: {
			loblaws: {
				stores: "/stores/:chain_brand?/:chain?",
			},
		},
	});
});

export default router;
