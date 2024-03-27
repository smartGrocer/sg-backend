import { getLocalCachedData, saveToLocalCache } from "./localCache/localCache";
import { getRedisCache, saveToRedisCache } from "./redis/redisCache";

export const getCachedData = async (key: string) => {
	const response = await getLocalCachedData(key);

	if (response) {
		return response;
	}

	const redisResponse = await getRedisCache(key);
	if (redisResponse) {
		return redisResponse;
	}

	console.log(`CACHE MISS: ${key}`);
	return null;
};

export const saveToCache = async ({
	key,
	data,
	cacheInRedis,
}: {
	key: string;
	data: any;
	cacheInRedis: boolean;
}) => {
	await saveToLocalCache(key, data, 1000 * 60 * 60 * 24 * 2);

	// save to redis
	if (cacheInRedis) {
		await saveToRedisCache(key, data, 1000 * 60 * 60 * 24 * 30);
	}
};
