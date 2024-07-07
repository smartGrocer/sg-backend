import logger from "../../logging/logger";

export const localCache = new Map();

export const getLocalCachedData = async (key: string) => {
	// read from cache
	const cachedData = await localCache.get(key);

	if (cachedData) {
		logger.verbose({
			message: `CACHE HIT:Local: ${key}`,
			service: "cache",
		});
		// remove destroy from the return object
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { destroy, updatedAt, ...data } = cachedData;

		return data.data;
	}
	return null;
};

export const saveToLocalCache = async (
	key: string,
	data: unknown,
	ttl?: number
) => {
	logger.verbose({
		message: `CACHE SET:Local: ${key}`,
		service: "cache",
	});
	localCache.set(key, {
		data,
		updatedAt: new Date(),
		destroy: setTimeout(
			() => {
				logger.verbose({
					message: `Cache cleaned up for ${key}`,
					service: "cache",
				});
				localCache.delete(key);
			},
			ttl || 1000 * 60 * 60 * 24 * 7
		),
	});
};
