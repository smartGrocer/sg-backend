import getSecret from "../helpers/getSecret";
import logger from "../logging/axiom";
import { getLocalCachedData, saveToLocalCache } from "./localCache/localCache";
// eslint-disable-next-line import/no-cycle
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
	if (getSecret("USE_REDIS") === "false") {
		return null;
	}

	const response = await getLocalCachedData(key);

	if (response) {
		return response;
	}

	if (cacheInRedis) {
		const redisResponse = await getRedisCache(key);
		if (redisResponse) {
			await saveToLocalCache(key, redisResponse, CACHE_IN_LOCAL_MS);
			return redisResponse;
		}
	}

	logger.info({
		message: `CACHE MISS: ${key}`,
	});
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
	if (getSecret("USE_REDIS") === "false") {
		return;
	}
	await saveToLocalCache(key, data, CACHE_IN_LOCAL_MS);

	// save to redis
	if (cacheInRedis) {
		await saveToRedisCache(key, data, CACHE_IN_REDIS_MS);
	}
};
