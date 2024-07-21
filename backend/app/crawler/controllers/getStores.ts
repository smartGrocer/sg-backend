import { Request, Response } from "express";
import filterStoresByLocation from "../../common/helpers/filterStoresByLocation";
import { getCoordinatesFromPostal } from "../../common/helpers/getCoordinatesFromPostal";
import { validatePostalCode } from "../../common/helpers/validatePostalCode";
import {
	AllParentCompanyList,
	IStoreProps,
} from "../../common/types/common/store";
import fetchLoblawsStores from "../fetch/stores/loblaws/fetchLoblawsStores";
import fetchMetroStores from "../fetch/stores/metro/fetchMetroStores";
import fetchWalmartStores from "../fetch/stores/walmart/fetchWalmartStores";

const getStores = async (req: Request, res: Response) => {
	const { params } = req;
	const parent_company = params.parent_company as AllParentCompanyList;
	const showAllStores = parent_company === "all";

	const postalCode = (req.query.postal_code || "m9b6c2") as string;
	const validPostalCode = validatePostalCode(postalCode);

	const distance = Number(req.query.distance as string) || 5000;

	const allStores: IStoreProps[] = [];

	// if parent_company is not provided or is invalid
	if (!Object.values(AllParentCompanyList).includes(parent_company)) {
		return res.status(400).json({
			message: `Invalid parent_company, please provide a valid parent_company as a param: ?parent_company=metro.`,
			availableOptions: Object.values(AllParentCompanyList),
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

	// if the parent_company is loblaws
	if (parent_company === AllParentCompanyList.loblaws || showAllStores) {
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

	// if the parent_company is metro or foodbasics
	if (
		parent_company === AllParentCompanyList.metro ||
		parent_company === AllParentCompanyList.foodbasics ||
		showAllStores
	) {
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

	if (parent_company === AllParentCompanyList.walmart || showAllStores) {
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
};

export default getStores;
