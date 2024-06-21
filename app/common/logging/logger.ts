import winston from "winston";
import getSecret from "../helpers/getSecret";

const logger = winston.createLogger({
	level: "debug",
	format: winston.format.combine(
		winston.format.errors({ stack: true }),
		winston.format.simple()
	),
	defaultMeta: { env: getSecret("NODE_ENV") },
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: "logs/error.log",
			level: "error",
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.json()
			),
		}),
		new winston.transports.File({
			filename: "logs/combined.log",
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.json()
			),
		}),
	],
	exceptionHandlers: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: "logs/exceptions.log",
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.json()
			),
		}),
	],
	rejectionHandlers: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: "logs/rejections.log",
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.json()
			),
		}),
	],
});

logger.verbose({
	message: "Logger successfully setup!",
	service: "logger",
});

export default logger;
