import Redis from "ioredis";
import getSecret from "../../helpers/getSecret";

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
			console.log("Connection to Redis Session Store timed out.");
		} else if (error.code === "ECONNREFUSED") {
			console.log("Connection to Redis Session Store refused!");
		} else console.log(error);
	});

	// Listen to 'reconnecting' event to Redis
	redis.on("reconnecting", () => {
		if (redis.status === "reconnecting")
			console.log("Reconnecting to Redis Session Store...");
		else console.log("Error reconnecting to Redis Session Store.");
	});

	// Listen to the 'connect' event to Redis
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	redis.on("connect", (err: any) => {
		if (!err) console.log("Connected to Redis Session Store!");
	});

	return redis;
};
export default connectToRedis;
