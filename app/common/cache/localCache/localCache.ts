import logger from "../../logging/axiom";

export const localCache = new Map();

export const getLocalCachedData = async (key: string) => {
	// read from cache
	const cachedData = await localCache.get(key);

	if (cachedData) {
		logger.info({
			message: `CACHE HIT:Local: ${key}`,
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
	logger.info({
		message: `CACHE SET:Local: ${key}`,
	});
	localCache.set(key, {
		data,
		updatedAt: new Date(),
		destroy: setTimeout(
			() => {
				logger.info({
					message: `Cache cleaned up for ${key}`,
				});
				localCache.delete(key);
			},
			ttl || 1000 * 60 * 60 * 24 * 7
		),
	});
};
