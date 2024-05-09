// eslint-disable-next-line import/no-cycle
import { redis } from "../../../index";
import logger from "../../logging/axiom";

export const getRedisCache = async (key: string) => {
	const response = (await redis.get(key)) || null;

	if (response) {
		logger.info({
			message: `CACHE HIT:Redis: ${key}`,
		});
		return JSON.parse(response.toString());
	}
	return null;
};

export const saveToRedisCache = async (
	key: string,
	data: unknown,
	ttl?: number
) => {
	logger.info({
		message: `CACHE SET:Redis: ${key}`,
	});
	return redis.set(
		key,
		JSON.stringify(data),
		"EX",
		ttl || 1000 * 60 * 60 * 24 * 7
	);
};
