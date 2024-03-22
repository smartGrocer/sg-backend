import { getCachedData, saveToCache } from "./localCache/localCache";
import { getRedisCache, saveToRedisCache } from "./redis/redisCache";

export const getCachedStoreData = async (key: string) => {
	const response = await getCachedData(key);

	if (response) {
		return response;
	}

	const redisResponse = await getRedisCache(key);
	if (redisResponse) {
		return redisResponse;
	}

	console.log("CACHE MISS:Store");
	return null;
};

export const saveToCacheStore = async ({
	key,
	data,
	cacheInRedis,
}: {
	key: string;
	data: any;
	cacheInRedis: boolean;
}) => {
	await saveToCache(key, data, 1000 * 60 * 60 * 24 * 2);

	// save to redis
	if (cacheInRedis) {
		await saveToRedisCache(key, data, 1000 * 60 * 60 * 24 * 30);
	}
};
