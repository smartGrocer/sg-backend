import express, { Application, Request, Response } from "express";
import { Redis } from "ioredis";
import dotenv from "dotenv";
import cors from "cors";
import getSecret from "./common/helpers/getSecret";
import cronAddDescMetro from "./common/cron/cronAddDescMetro";
import scheduleCron from "./common/cron/cron";

// For env File
dotenv.config();

// eslint-disable-next-line import/first
import logger from "./common/helpers/logger";
// eslint-disable-next-line import/first, import/no-cycle
import routes from "./crawler/routes/routes";
// eslint-disable-next-line import/first
import connectToRedis from "./common/cache/redis/connentRedis";
// eslint-disable-next-line import/first
import connectDB from "./common/db/connectDB";

// eslint-disable-next-line import/no-mutable-exports
let redis: Redis;

const app: Application = express();
const port = getSecret("PORT") || 7000;

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// cors middleware
app.use(
	cors({
		origin: "*",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		preflightContinue: false,
		optionsSuccessStatus: 204,
	})
);

// on every response, add a header
app.use((req: Request, res: Response, next) => {
	res.header("server", "crawler-service");
	next();
});

// routes
app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
	// log with current date and time in EST
	res.json({
		message: `crawler-service is up and running as of: ${new Date().toLocaleString(
			"en-US",
			{
				timeZone: "America/New_York",
			}
		)}`,
	});
});

app.get("/ping", (req: Request, res: Response) => {
	res.json({
		message: "pong",
	});
});

const startServer = async (): Promise<void> => {
	try {
		redis = await connectToRedis();

		await connectDB();

		return new Promise<void>((resolve) => {
			app.listen(port, () => {
				console.log(
					`Crawler-server running on ${
						process.env.NODE_ENV === "production"
							? port
							: `http://localhost:${port}`
					} `
				);
				resolve();
			});
		});
	} catch (error) {
		console.error(error);
		process.exit(1);
		return Promise.reject();
	}
};

if (getSecret("NODE_ENV") !== "test") {
	startServer().then(() => {
		if (getSecret("NODE_ENV") === "production") {
			setTimeout(() => {
				scheduleCron();
				cronAddDescMetro();
				// wait for 10 mins
			}, 600000);
		}
	});
}

export { redis, startServer };

export default app;
