import express, { Request, Response } from "express";
import fetchLoblawsStores from "../fetch/stores/loblaws/fetchLoblawsStores";
import {
	AllStoreChainBrands,
	IStoreProps,
} from "../../common/types/common/store";
import fetchMetroStores from "../fetch/stores/metro/fetchMetroStores";
import fetchWalmartStores from "../fetch/stores/walmart/fetchWalmartStores";
import { validatePostalCode } from "../../common/helpers/validatePostalCode";
import { getCoordinatesFromPostal } from "../../common/helpers/getPostalCode";
import filterStoresByLocation from "../../common/helpers/filterStoresByLocation";
import { LoblawsChainName } from "../../common/types/loblaws/loblaws";
import searchLoblaws from "../fetch/search/loblaws/searchLoblaws";
import { MetroChain } from "../../common/types/metro/metro";
import searchProducts from "../fetch/search/metro/searchProducts";
import searchMetro from "../fetch/search/metro/searchMetro";
import getProduct from "../fetch/product/loblaws/getProduct";
import getLoblawsProduct from "../fetch/product/loblaws/getLoblawsProduct";
import getMetroProduct from "../fetch/product/metro/getMetroProduct";

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

		const distance = Number(req.query.distance as string) || 5000;

		const allStores: IStoreProps[] = [];

		// if chain brand is not provided or is invalid
		if (!Object.values(AllStoreChainBrands).includes(chain_brand)) {
			return res.status(400).json({
				message: `Invalid chain brand, please provide a valid chain brand.`,
				availableOptions: Object.values(AllStoreChainBrands),
			});
		}

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

			allStores.push(...(data || []));
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

			allStores.push(...(data || []));
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

			allStores.push(...(data || []));
		}

		const filteredAllStores = filterStoresByLocation({
			stores: allStores,
			distance,
			userCoordinates,
		});

		return res.status(200).json({
			message: `Stores fetched successfully for all stores.`,
			count: filteredAllStores.length,
			data: filteredAllStores,
		});
	}
);

router.get(
	"/product/search/:product_search?",
	async (req: Request, res: Response) => {
		const search_term = req.params.product_search;
		const chainName = req.query.chain as
			| LoblawsChainName
			| MetroChain
			| "walmart";
		const store_id = req.query.store_id as string;

		if (!search_term) {
			return res.status(400).json({
				message: `Search term is required, please provide a search term as a query parameter like so: /search/:product_search?chain=chain_name`,
				availableOptions: [
					`/search/:product_search`,
					`/search/eggs`,
					"/search/milk",
				],
			});
		}

		if (
			Object.values(LoblawsChainName).includes(
				chainName as LoblawsChainName
			)
		) {
			const { message, data, code, availableOptions, count } =
				await searchLoblaws({
					search_term,
					chainName: chainName as LoblawsChainName,
					store_id,
				});

			return res.status(code).json({
				message,
				availableOptions,
				count,
				data,
			});
		}

		if (Object.values(MetroChain).includes(chainName as MetroChain)) {
			const { message, data, code, availableOptions, count } =
				await searchMetro({
					search_term,
					chainName: chainName as MetroChain,
					store_id,
				});

			return res.status(code).json({
				message,
				availableOptions,
				count,
				data,
			});
		}

		return res.status(400).json({
			message: `Invalid chain name, please provide a valid chain name as a query parameter like so: /search/:product_search?chain=chain_name`,
			availableOptions: [
				...Object.values(LoblawsChainName),
				...Object.values(MetroChain),
				"walmart",
			],
		});
	}
);

router.get("/product/lookup", async (req: Request, res: Response) => {
	const product_id = req.query.product_id as string;
	const link_to_product = req.query.url as string;
	const chainName = req.query.chain as
		| LoblawsChainName
		| MetroChain
		| "walmart";
	const store_id = req.query.store_id as string;

	if (!product_id && !link_to_product) {
		return res.status(400).json({
			message: `Either product_id or url is required as a query param, please provide one like so: /product/lookup?product_id=1234&url=www.example.com/product/id/1234`,
			availableOptions: [
				"/product/lookup?product_id=1234",
				"/product/lookup?url=www.example.com/product/id/1234",
				"/product/lookup?product_id=1234&url=www.example.com/product/id/1234",
				"/product/lookup?product_id=1234&chain=chain_name",
				"/product/lookup?url=www.example.com/product/id/1234&chain=chain_name",
			],
		});
	}

	if (
		Object.values(LoblawsChainName).includes(chainName as LoblawsChainName)
	) {
		const { message, data, code, availableOptions } =
			await getLoblawsProduct({
				product_id,
				store_id,
				chainName: chainName as LoblawsChainName,
			});

		return res.status(code).json({
			message,
			availableOptions,
			data,
		});
	}

	if (Object.values(MetroChain).includes(chainName as MetroChain)) {
		const { message, data, code, availableOptions } = await getMetroProduct(
			{
				product_id,
				url: link_to_product,
				chainName: chainName as MetroChain,
				store_id,
			}
		);

		return res.status(code).json({
			message,
			availableOptions,
			data,
		});
	}

	return res.status(400).json({
		message: `Invalid chain name, please provide a valid chain name as a query parameter like so: /product/id/:product_id?chain=chain_name`,
		availableOptions: [
			...Object.values(LoblawsChainName),
			...Object.values(MetroChain),
			"walmart",
		],
	});
});

router.get("*", (req, res) => {
	res.json({
		message:
			"Welcome to the Crawler Service. Please use one of the available routes",
		availableRoutes: {
			loblaws: {
				stores: "/stores/:chain_brand/:chain?postal_code=postal_code&distance=5000",
				product_search:
					"/product/search/:product_search?chain=chain_name&store_id=1234",
				product_lookup:
					"/product/lookup?product_id=1234&url=www.example.com/product/id/1234&chain=chain_name",
			},
		},
	});
});

export default router;
