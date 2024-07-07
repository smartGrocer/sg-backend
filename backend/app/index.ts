import express, { Application, Request, Response } from "express";
import { Redis } from "ioredis";
import dotenv from "dotenv";
import cors from "cors";
import getSecret from "./common/helpers/getSecret";
import cronAddDescMetro from "./common/cron/cronAddDescMetro";
import scheduleCron from "./common/cron/cron";
import apiLogger from "./common/helpers/apiLogger";
import routes from "./crawler/routes/routes";
import connectToRedis from "./common/cache/redis/connectRedis";
import connectDB from "./common/db/connectDB";
import logger from "./common/logging/logger";

// For env File
dotenv.config();

// eslint-disable-next-line import/no-mutable-exports
let redis: Redis;

const app: Application = express();
const port = getSecret("PORT") || 7000;

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiLogger);

// cors middleware
app.use(
	cors({
		origin: "*",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		preflightContinue: false,
		optionsSuccessStatus: 204,
	})
);

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

		await new Promise<void>((resolve, reject) => {
			const server = app.listen(port, () => {
				logger.info({
					message: `Crawler-server running on ${
						process.env.NODE_ENV === "production"
							? port
							: `http://localhost:${port}`
					}`,
					service: "crawler-server",
				});

				resolve();
			});

			server.on("error", (error) => {
				reject(error);
			});
		});
	} catch (error) {
		logger.error({
			message: "Error starting server - 1",
			error: error?.toString() ?? "Unknown error",
			service: "crawler-server",
		});

		logger.on("error", (err) => {
			// eslint-disable-next-line no-console
			console.error("Logger error:", err);
		});

		logger.on("finish", () => {
			// eslint-disable-next-line no-console
			console.error("Logger finished. Exiting...");
			// winston doesnt seem to properly flush the logs before the process exits
			logger.error({
				message: "Exiting...",
				service: "crawler-server",
			});
			setTimeout(() => {
				process.exit(1);
			}, 2000);
		});

		logger.end();
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

export { redis };

export default app;
