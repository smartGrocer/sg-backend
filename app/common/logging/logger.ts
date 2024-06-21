import winston from "winston";
import getSecret from "../helpers/getSecret";

const logFormat = winston.format.printf(
	({ timestamp, level, message, service, error }) => {
		return `${timestamp} [${service}] ${level}: ${message} ${
			error ? `: ${error.stack}` : ""
		}`;
	}
);
const logger = winston.createLogger({
	level: "debug",

	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.errors({ stack: false }),
		logFormat
	),
	defaultMeta: { env: getSecret("NODE_ENV") },
	transports: [
		new winston.transports.Console({
			format: winston.format.colorize({ all: true }),
		}),
		new winston.transports.File({
			filename: "logs/error.log",
			level: "error",
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.errors({ stack: true }),
				logFormat
			),
		}),
		new winston.transports.File({
			filename: "logs/combined.log",
			level: "debug",
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.errors({ stack: true }),

				logFormat
			),
		}),
	],
	exceptionHandlers: [
		new winston.transports.Console({
			format: winston.format.colorize({ all: true }),
		}),
		new winston.transports.File({
			filename: "logs/exceptions.log",
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.errors({ stack: true }),
				logFormat
			),
		}),
	],
	rejectionHandlers: [
		new winston.transports.Console({
			format: winston.format.colorize({ all: true }),
		}),
		new winston.transports.File({
			filename: "logs/rejections.log",
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.errors({ stack: true }),
				logFormat
			),
		}),
	],
});

logger.verbose({
	message: "Logger successfully setup!",
	service: "logger",
});

export default logger;
