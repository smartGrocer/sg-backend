import { Request, Response, NextFunction } from "express";

// Handle GET requests to /api route
const logger = (req: Request, res: Response, next: NextFunction): void => {
	// if not /ping
	if (req.url !== "/ping") {
		// log time taken to process request
		const start = Date.now();
		res.on("finish", () => {
			const elapsed = Date.now() - start;
			console.log(
				`${req.method}:${res.statusCode}: '${req.protocol}://${req.get("host")}${
					req.originalUrl
				}' at: '${new Date().toLocaleString("en-US", {
					timeZone: "America/New_York",
				})}' from ${
					req.ip ||
					req.headers["x-forwarded-for"] ||
					req.socket.remoteAddress ||
					req.ip ||
					null
				} | ${elapsed}ms | ${res.get("Content-Length") || 0} b`
			);
		});
	}
	next();
};

export default logger;
