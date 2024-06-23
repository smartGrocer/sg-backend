// eslint-disable-next-line import/no-cycle
import { redis } from "../../../index";
import logger from "../../logging/logger";

export const getRedisCache = async (key: string) => {
	const response = (await redis.get(key)) || null;

	if (response) {
		logger.verbose({
			message: `CACHE HIT:Redis: ${key}`,
			service: "cache",
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
	logger.verbose({
		message: `CACHE SET:Redis: ${key}`,
		service: "cache",
	});
	return redis.set(
		key,
		JSON.stringify(data),
		"EX",
		ttl || 1000 * 60 * 60 * 24 * 7
	);
};
