export const localCache = new Map();

export const getCachedData = (key: string) => {
	// read from cache
	const cachedData = localCache.get(key);
	if (cachedData) {
		// remove destroy from the return object
		const { destroy, ...data } = cachedData;
		return data;
	}
	return null;
};

export const saveToCache = (key: string, data: any, ttl: number) => {
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
