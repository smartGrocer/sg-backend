import express, { Application, Request, Response } from "express";
import getSecret from "../common/helpers/getSecret";
import cors from "cors";
import connectToDb from "../common/db/db";
import { localCache } from "../common/cache/localCache/localCache";
import dotenv from "dotenv";
//For env File
dotenv.config();
import apiLogger from "../common/helpers/logger";
import routes from "./routes/routes";

// init localCache
localCache;

const app: Application = express();
const port = getSecret("PORT_API") || 4000;

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
		message: `Api-service is up and running as of: ${new Date().toLocaleString(
			"en-US",
			{
				timeZone: "America/New_York",
			}
		)}`,
	});
});

connectToDb()
	.then(() => {
		app.listen(port, () => {
			console.log(
				`Server running on ${process.env.NODE_ENV === "production" ? port : `http://localhost:${port}`} `
			);
		});
	})
	.catch((error: unknown) => {
		console.error(error);
		process.exit(1);
	});
