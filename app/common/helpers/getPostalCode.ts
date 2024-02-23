import { getCachedData, saveToCache } from "../cache/localCache/localCache";
import { getPostalcode } from "../loadPostal";

export interface IPostalData {
	lat: number;
	lng: number;
	city: string;
	province: string;
	postalCode: string;
	formattedPostalCode: string;
}

export interface IPostalDataWithDate {
	data: IPostalData;
	updatedAt: Date;
}

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

	saveToPostalCache(postalCode, returnData);

	if (postalData) {
		return returnData;
	} else {
		return null;
	}
};

const formatPostalCode = (postalCode: string): string => {
	// format 1a1a1a into 1A1 A1A
	const firstPart = postalCode.slice(0, 3).toUpperCase();
	const secondPart = postalCode.slice(3, 6).toUpperCase();
	return `${firstPart} ${secondPart}`;
};

const getCachedPostalData = async (
	postalCode: string
): Promise<IPostalData | null> => {
	return await getCachedData(postalCode);
};

const saveToPostalCache = (postalCode: string, data: IPostalData) => {
	saveToCache(postalCode, data, 1000 * 60 * 60 * 24 * 7);
};
