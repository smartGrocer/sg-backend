import express, { Request, Response } from "express";
import fetchLoblawsStores from "../../crawler/fetch/stores/loblaws/fetchLoblawsStores";
import { AllStoreChainBrands } from "../../common/types/common/store";
import fetchMetroStores from "../../crawler/fetch/stores/metro/fetchMetroStores";
import fetchWalmartStores from "../../crawler/fetch/stores/walmart/fetchWalmartStores";
import {
	TValidPostalCode,
	validatePostalCode,
} from "../../common/helpers/validatePostalCode";
import { getCoordinatesFromPostal } from "../../data/readJson";
const router = express.Router();

// Routes
router.get(
	"/stores/:chain_brand?/:chain?",
	async (req: Request, res: Response) => {
		const params = req.params;
		const chain_brand = params.chain_brand as AllStoreChainBrands;

		const postalCode = req.query.postal_code as string;

		const validPostalCode = validatePostalCode(postalCode);

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
			const { data, code, message } = await fetchLoblawsStores({
				req,
				res,
				validPostalCode,
			});

			if (code !== 200) {
				return res.status(code).json({
					message,
					available_options: data,
				});
			}

			return res.status(code).json({
				message,
				count: data?.length || 0,
				data,
			});
		}

		// if the chain brand is metro
		if (chain_brand === AllStoreChainBrands.metro) {
			const stores = await fetchMetroStores({
				req,
				res,
				validPostalCode,
			});

			if (stores.code !== 200) {
				return res.status(stores.code).json({
					message: stores.message,
					availableChains: stores.data,
				});
			}

			return res.status(stores.code).json({
				message: stores.message,
				count: stores.data?.length || 0,
				data: stores.data,
			});
		}

		if (chain_brand === AllStoreChainBrands.walmart) {
			const stores = await fetchWalmartStores({
				req,
				res,
				validPostalCode,
			});

			if (stores.code !== 200) {
				return res.status(stores.code).json({
					message: stores.message,
					availableParams: stores.availableParams,
				});
			}

			return res.status(stores.code).json({
				message: stores.message,
				count: stores.data?.length || 0,
				data: stores.data,
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
