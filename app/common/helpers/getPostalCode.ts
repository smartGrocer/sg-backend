import getPostalcode from "./loadPostal";
import {
	getLocalCachedData,
	saveToLocalCache,
} from "../cache/localCache/localCache";

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
	return getLocalCachedData(postalCode);
};

const saveToPostalCache = (postalCode: string, data: IPostalData): void => {
	saveToLocalCache(postalCode, data, 1000 * 60 * 60 * 24 * 7);
};

const formatPostalCode = (postalCode: string): string => {
	// format 1a1a1a into 1A1 A1A
	const firstPart = postalCode.slice(0, 3).toUpperCase();
	const secondPart = postalCode.slice(3, 6).toUpperCase();
	return `${firstPart} ${secondPart}`;
};

export const getCoordinatesFromPostal = async (
	postalCode: string
): Promise<IPostalData | null> => {
	const cachedData = await getCachedPostalData(postalCode);
	if (cachedData) {
		return cachedData;
	}

	const postalData = getPostalcode(formatPostalCode(postalCode));

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
