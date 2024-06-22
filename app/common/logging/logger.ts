import winston from "winston";
import getSecret from "../helpers/getSecret";

const logFormat = winston.format.printf(
	({ timestamp, level, message, service, error }) => {
		return `${timestamp} [${service}] ${level}: ${message} ${
			error ? `: ${error.stack}` : ""
		}`;
	}
);

const createFormat = (stack: boolean): winston.Logform.Format =>
	winston.format.combine(
		winston.format.timestamp(),
		winston.format.errors({ stack }),
		logFormat
	);

const logger = winston.createLogger({
	level: "debug",

	format: createFormat(true),
	defaultMeta: { env: getSecret("NODE_ENV") },
	transports: [
		new winston.transports.Console({
			format: winston.format.colorize({ all: true }),
		}),
		new winston.transports.File({
			filename: "logs/error.log",
			level: "error",
			format: createFormat(true),
		}),
		new winston.transports.File({
			filename: "logs/combined.log",
			level: "debug",
			format: createFormat(true),
		}),
	],
	exceptionHandlers: [
		new winston.transports.Console({
			format: winston.format.colorize({ all: true }),
		}),
		new winston.transports.File({
			filename: "logs/exceptions.log",
			format: createFormat(true),
		}),
	],
	rejectionHandlers: [
		new winston.transports.Console({
			format: winston.format.colorize({ all: true }),
		}),
		new winston.transports.File({
			filename: "logs/rejections.log",
			format: createFormat(true),
		}),
	],
});

logger.verbose({
	message: "Logger successfully setup!",
	service: "logger",
});

export default logger;
