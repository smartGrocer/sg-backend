import redis from "./connentRedis";

export const getRedisCache = async (key: string) => {
	const response = (await redis.get(key)) || null;

	if (response) {
        console.log(`CACHE HIT:Redis: ${key}`);
		return JSON.parse(response.toString());
	}
	return null;
};

export const saveToRedisCache = async (
	key: string,
	data: any,
	ttl?: number
) => {
    console.log(`CACHE SET:Redis: ${key}`);
	return await redis.set(
		key,
		JSON.stringify(data),
		"EX",
		ttl || 1000 * 60 * 60 * 24 * 7
	);
};
