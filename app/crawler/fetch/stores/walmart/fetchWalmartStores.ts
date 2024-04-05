// eslint-disable-next-line import/no-cycle
import getWalmartStores from "./getStore";
import filterStoresByLocation from "../../../../common/helpers/filterStoresByLocation";
import {
	IFetchStores,
	IFetchStoresReturn,
} from "../../../../common/types/common/store";
import { writeStoreToDb } from "../../../../common/db/writeToDB";

interface IFetchWalmartStores extends IFetchStores {}

const fetchWalmartStores = async ({
	validPostalCode,
	userCoordinates,
	distance,
	showAllStores,
}: IFetchWalmartStores): Promise<IFetchStoresReturn> => {
	if (!validPostalCode) {
		return {
			message: `Invalid postal code, please provide a valid postal code.`,
			availableOptions: "postal_code",
			code: 400,
		};
	}

	const stores = await getWalmartStores({
		validPostalCode,
	});

	if (stores instanceof Error) {
		return {
			message: stores.message,
			code: 500,
		};
	}

	const filteredStores = showAllStores
		? stores
		: filterStoresByLocation({
				stores,
				distance,
				userCoordinates,
			});

	// write stores to db
	await writeStoreToDb(filteredStores);

	return {
		message: `Stores fetched successfully for walmart`,
		count: filteredStores.length,
		data: filteredStores,
		code: 200,
	};
};

export default fetchWalmartStores;
