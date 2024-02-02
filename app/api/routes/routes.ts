import express from "express";
import fetchLoblawsStores from "../../crawler/fetch/stores/loblaws/fetchLoblawsStores";
import { AllStoreChainBrands } from "../../common/types/common/store";
import fetchFoodBasicStores from "../../crawler/fetch/stores/foodbasics/fetchFoodBasicStores";
const router = express.Router();

// Routes
router.get("/stores/:chain_brand?/:chain?", async (req, res) => {
	const params = req.params;
	const chain_brand = params.chain_brand as AllStoreChainBrands;

	// if chain brand is not provided or is invalid
	if (!Object.values(AllStoreChainBrands).includes(chain_brand)) {
		return res.status(400).json({
			message: `Invalid chain brand, please provide a valid chain brand.`,
			availableChains: Object.values(AllStoreChainBrands),
		});
	}

	// if the chain brand is loblaws
	if (chain_brand === AllStoreChainBrands.loblaws) {
		const { data, code, message } = await fetchLoblawsStores(req, res);

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

	// if the chain brand is foodbasics
	if (chain_brand === AllStoreChainBrands.foodbasics) {
		const stores = await fetchFoodBasicStores(req, res);

		if (stores.code !== 200) {
			return res.status(stores.code).json({
				message: stores.message,
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
});

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
