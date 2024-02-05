import express, { Request, Response } from "express";
import fetchLoblawsStores from "../../crawler/fetch/stores/loblaws/fetchLoblawsStores";
import { AllStoreChainBrands, IStoreProps } from "../../common/types/common/store";
import fetchMetroStores from "../../crawler/fetch/stores/metro/fetchMetroStores";
import fetchWalmartStores from "../../crawler/fetch/stores/walmart/fetchWalmartStores";
import {
	TValidPostalCode,
	validatePostalCode,
} from "../../common/helpers/validatePostalCode";
import { getCoordinatesFromPostal } from "../../common/helpers/getPostalCode";
import filterStoresByLocation from "../../common/helpers/filterStoresByLocation";
const router = express.Router();

// Routes
router.get(
	"/stores/:chain_brand?/:chain?",
	async (req: Request, res: Response) => {
		const params = req.params;
		const chain_brand = params.chain_brand as AllStoreChainBrands;
		const showAllStores = chain_brand === "all";

		const postalCode = (req.query.postal_code || "m9b6c2") as string;
		const validPostalCode = validatePostalCode(postalCode);

		const distance = Number(req.query.distance as string) || 10000;

		const allStores: IStoreProps[] = [];

		if (!validPostalCode) {
			return res.status(400).json({
				message:
					"Invalid postal code. Please provide a valid postal code as a query parameter in the format: ?postal_code=a1a1a1",
				data: `postal_code=${!postalCode ? "''" : postalCode} might be invalid. Please provide a valid postal code.`,
			});
		}
		const userCoordinates = await getCoordinatesFromPostal(postalCode);

		if (!userCoordinates) {
			return res.status(400).json({
				message: `Invalid postal code or postal code not found. Please provide a valid postal code.`,
				data: `postal_code=${!postalCode ? "''" : postalCode} might be invalid or could not be found. Please provide a valid postal code.`,
			});
		}

		// if chain brand is not provided or is invalid
		if (!Object.values(AllStoreChainBrands).includes(chain_brand)) {
			return res.status(400).json({
				message: `Invalid chain brand, please provide a valid chain brand.`,
				availableChains: Object.values(AllStoreChainBrands),
			});
		}

		// if the chain brand is loblaws
		if (chain_brand === AllStoreChainBrands.loblaws || showAllStores) {
			const { message, count, data, code, availableOptions } =
				await fetchLoblawsStores({
					req,
					res,
					validPostalCode,
					userCoordinates,
					distance,
					showAllStores,
				});

			if (!showAllStores) {
				return res.status(code).json({
					message,
					count,
					data,
					availableOptions,
				});
			}

			allStores.push(...data || []);
		}

		// if the chain brand is metro or foodbasics
		if (chain_brand === AllStoreChainBrands.metro || showAllStores) {
			const { message, count, data, code, availableOptions } =
				await fetchMetroStores({
					req,
					res,
					validPostalCode,
					userCoordinates,
					distance,
					showAllStores,
				});

			if (!showAllStores) {
				return res.status(code).json({
					message,
					count,
					data,
					availableOptions,
				});
			}

			allStores.push(...data || []);
		}

		if (chain_brand === AllStoreChainBrands.walmart || showAllStores) {
			const { message, count, data, code, availableOptions } =
				await fetchWalmartStores({
					req,
					res,
					validPostalCode,
					userCoordinates,
					distance,
					showAllStores,
				});

			if (!showAllStores) {
				return res.status(code).json({
					message,
					count,
					data,
					availableOptions,
				});
			}

			allStores.push(...data || []);
		}

		const filteredAllStores = filterStoresByLocation({
			stores: allStores,
			distance,
			userCoordinates,
		});

		
		return res.status(200).json({
			message: `Stores fetched successfully for all stores.`,
			count: allStores.length,
			data: allStores,
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
