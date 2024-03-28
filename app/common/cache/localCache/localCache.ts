export const localCache = new Map();

export const getLocalCachedData = async (key: string) => {
	// read from cache
	const cachedData = await localCache.get(key);

	if (cachedData) {
		console.log(`CACHE HIT:Local: ${key}`);
		// remove destroy from the return object
		const { destroy, updatedAt, ...data } = cachedData;

		return data.data;
	}
	return null;
};

export const saveToLocalCache = async (
	key: string,
	data: any,
	ttl?: number
) => {
	console.log(`CACHE SET:Local: ${key}`);
	localCache.set(key, {
		data,
		updatedAt: new Date(),
		destroy: setTimeout(
			() => {
				console.log(`Cache cleaned up for ${key}`);
				localCache.delete(key);
			},
			ttl || 1000 * 60 * 60 * 24 * 7
		),
	});
};
