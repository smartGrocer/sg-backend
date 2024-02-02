import express from "express";
import getLoblawsStores from "../../crawler/fetch/stores/loblaws/getStore";
import { LoblawsChainName } from "../../common/types/loblaws/loblaws";
const router = express.Router();

// Routes
router.get("/stores/:chain", async (req, res) => {
	// chain name
	const chainName = req.params.chain as LoblawsChainName;

	if (!chainName) {
		return res
			.status(400)
			.json(
				"Store_name is required, please provide a store name as /stores/:store_name"
			);
	}

	// chain name has to be in the enum
	if (!Object.values(LoblawsChainName).includes(chainName)) {
		return res.status(400).json({
			message: `Invalid chain name, please provide a valid chain name. Pick a valid chain name`,
			availableChains: Object.values(LoblawsChainName),
		});
	}

	// get stores
	const stores = await getLoblawsStores({ chainName });

	if (stores instanceof Error) {
		return res.status(500).json(stores.message);
	}

	return res.json({
		count: stores.length,
		stores,
	});
});

router.get("*", (req, res) => {
	res.json({
		message: "Welcome to the Loblaws API",
	});
});

export default router;
