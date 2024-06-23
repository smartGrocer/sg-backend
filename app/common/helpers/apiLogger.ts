import { Request, Response, NextFunction } from "express";
import logger from "../logging/logger";

// Handle GET requests to /api route
const apiLogger = (req: Request, res: Response, next: NextFunction): void => {
	// if not /ping
	if (req.url !== "/ping") {
		// log time taken to process request
		const start = Date.now();
		res.on("finish", () => {
			const elapsed = Date.now() - start;
			logger.http({
				message: `${req.method}:${res.statusCode}: '${req.protocol}://${req.get("host")}${
					req.originalUrl
				}' : '${new Date().toLocaleString("en-US", {
					timeZone: "America/New_York",
				})}' from ${
					req.ip ||
					req.socket.remoteAddress ||
					req.headers["x-forwarded-for"] ||
					req.ip ||
					null
				} | ${elapsed}ms | ${res.get("Content-Length") || 0} b`,
				service: "http",
			});
		});
	}
	next();
};

export default apiLogger;
