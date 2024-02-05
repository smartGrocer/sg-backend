import { Request, Response, NextFunction } from "express";

// Handle GET requests to /api route
export default function logger(
	req: Request,
	res: Response,
	next: NextFunction
) {
	// log time taken to process request
	const start = Date.now();
	res.on("finish", () => {
		const elapsed = Date.now() - start;
		console.log(
			`${req.method}: '${req.protocol}://${req.get("host")}${
				req.originalUrl
			}' at: '${new Date().toLocaleString("en-US", {
				timeZone: "America/New_York",
			})}' from ${
				req.ip ||
				req.headers["x-forwarded-for"] ||
				req.socket.remoteAddress ||
				req.ip ||
				null
			} | ${elapsed}ms`
		);
	});
	next();
}
