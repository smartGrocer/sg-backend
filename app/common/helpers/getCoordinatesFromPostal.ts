import findPostalcode from "./findPostalcode";
// eslint-disable-next-line import/no-cycle
import { getCachedData, saveToCache } from "../cache/storeCache";

export interface IPostalData {
	postalCode: string;
	formattedPostalCode: string;
	lat?: string;
	lng?: string;
	city?: string;
	province?: string;
}

export interface IPostalDataWithDate {
	data: IPostalData | null;
	updatedAt: Date;
}

const getCachedPostalData = async (
	postalCode: string
): Promise<IPostalData | null> => {
	// return getLocalCachedData(postalCode);

	return getCachedData({
		key: postalCode,
		cacheInRedis: false,
	});
};

const saveToPostalCache = async (
	postalCode: string,
	data: IPostalData
): Promise<void> => {
	// saveToLocalCache(postalCode, data, 1000 * 60 * 60 * 24 * 7);

	await saveToCache({
		key: postalCode,
		data,
		cacheInRedis: false,
	});
};

export const formatPostalCode = (postalCode: string): string => {
	// Remove all non-alphanumeric characters
	const cleanedPostalCode = postalCode.replace(/[^a-zA-Z0-9]/g, "");

	// Convert to uppercase
	const uppercasedPostalCode = cleanedPostalCode.toUpperCase();

	// Insert space in the middle
	const formattedPostalCode = `${uppercasedPostalCode.slice(0, 3)} ${uppercasedPostalCode.slice(3)}`;

	return formattedPostalCode;
};

export const getCoordinatesFromPostal = async (
	postalCode: string
): Promise<IPostalData | null> => {
	const cachedData = await getCachedPostalData(postalCode);
	if (cachedData) {
		return cachedData;
	}

	const postalData = findPostalcode(formatPostalCode(postalCode));

	const formattedPostalCode = formatPostalCode(postalCode);

	const returnData: IPostalData = {
		...postalData,
		postalCode,
		formattedPostalCode,
	};

	await saveToPostalCache(postalCode, returnData);

	if (postalData) {
		return returnData;
	}

	return null;
};
