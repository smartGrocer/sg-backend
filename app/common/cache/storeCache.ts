import { getCachedData, saveToCache } from "./localCache";

export const getCachedStoreData = (key: string) => {
	const response = getCachedData(key);
	if (response) {
		return response.data;
	}
};

export const saveToStoreCache = (key: string, data: any) => {
	saveToCache(key, data, 1000 * 60 * 60 * 24 * 7);
};
