const JSONInput = "app/data/CanadianPostalCodes.json";
import fs from "fs/promises";
import { localCache } from "../cache/localCache";

export const getCoordinatesFromPostal = async (postalCode: string) => {
	const cachedData = getCachedData(postalCode);
	if (cachedData) {
		return cachedData;
	}

	// read it line by line and parse it, if found return it
	const data = (await fs.readFile(JSONInput, "utf-8")) as unknown as string;
	const formattedPostalCode = formatPostalCode(postalCode);

	const postalData = JSON.parse(data)[formattedPostalCode];

	const returnData = {
		...postalData,
		postalCode,
		formattedPostalCode,
	};

	saveToCache(postalCode, returnData);

	if (postalData) {
		return {
			data: returnData,
			updatedAt: new Date(),
		};
	} else {
		return null;
	}
};

const formatPostalCode = (postalCode: string) => {
	// format 1a1a1a into 1A1 A1A
	const firstPart = postalCode.slice(0, 3).toUpperCase();
	const secondPart = postalCode.slice(3, 6).toUpperCase();
	return `${firstPart} ${secondPart}`;
};

const getCachedData = (postalCode: string) => {
	// read from cache
	const cachedData = localCache.get(postalCode);
	if (cachedData) {
		// remove destroy from the return object
		const { destroy, ...data } = cachedData;
		return data;
	}
};

const saveToCache = (postalCode: string, data: unknown) => {
	localCache.set(postalCode, {
		data,
		updatedAt: new Date(),
		destroy: setTimeout(
			() => {
				console.log(`Cache cleaned up for ${postalCode}`);
				localCache.delete(postalCode);
			},
			1000 * 60 * 60 * 24 * 7
		),
	});
};
