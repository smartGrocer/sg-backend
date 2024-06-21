import Redis from "ioredis";
import getSecret from "../../helpers/getSecret";
import logger from "../../logging/logger";

const connectToRedis = async (): Promise<Redis> => {
	const redis = new Redis({
		port: parseInt(getSecret("UPSTASH_PORT")),
		host: getSecret("UPSTASH_ENDPOINT"),
		username: "default",
		password: getSecret("UPSTASH_PASSWORD"),
		tls: {
			rejectUnauthorized: false,
		},
	});

	// Listen to 'error' events to the Redis connection
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	redis.on("error", (error: any) => {
		if (error.code === "ECONNRESET") {
			logger.error({
				message: "Connection to Redis Session Store timed out.",
				service: "redis",
			});
		} else if (error.code === "ECONNREFUSED") {
			logger.error({
				message: "Connection to Redis Session Store refused.",
				service: "redis",
			});
		} else {
			logger.error({
				message: "Error connecting to Redis Session Store.",
				error,
				service: "redis",
			});
		}
	});

	// Listen to 'reconnecting' event to Redis
	redis.on("reconnecting", () => {
		if (redis.status === "reconnecting") {
			logger.verbose({
				message: "Reconnecting to Redis Session Store...",
				service: "redis",
			});
		} else {
			logger.error({
				message: "Error reconnecting to Redis Session Store.",
				service: "redis",
			});
		}
	});

	// Listen to the 'connect' event to Redis
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	redis.on("connect", (err: any) => {
		if (!err) {
			logger.verbose({
				message: "Connected to Redis Session Store!",
				service: "redis",
			});
		}
	});

	return redis;
};
export default connectToRedis;
