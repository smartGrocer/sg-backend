import { getLocalCachedData, saveToLocalCache } from "./localCache/localCache";
import { getRedisCache, saveToRedisCache } from "./redis/redisCache";

const CACHE_IN_REDIS_MS = 1000 * 60 * 60 * 24 * 30;
const CACHE_IN_LOCAL_MS = 1000 * 60 * 60 * 24 * 2;

export const getCachedData = async ({
	key,
	cacheInRedis = true,
}: {
	key: string;
	cacheInRedis: boolean;
}) => {
	const response = await getLocalCachedData(key);

	if (response) {
		return response;
	}

	const redisResponse = await getRedisCache(key);
	if (redisResponse) {
		if (cacheInRedis) {
			await saveToLocalCache(key, redisResponse, CACHE_IN_LOCAL_MS);
		}
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
	data: unknown;
	cacheInRedis: boolean;
}) => {
	await saveToLocalCache(key, data, CACHE_IN_LOCAL_MS);

	// save to redis
	if (cacheInRedis) {
		await saveToRedisCache(key, data, CACHE_IN_REDIS_MS);
	}
};
