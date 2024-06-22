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

/**
 * Returns the filename for the log file based on the current date and log level
 * Creates a new log file for each month
 * e.g. logs/2024-06-error.log
 * or logs/2024-07-combined.log
 */
const getFilename = (level: string): string => {
	const now = new Date();
	const year = now.getFullYear();
	const month = (now.getMonth() + 1).toString().padStart(2, "0");
	return `logs/${year}-${month}-${level}.log`;
};

const logger = winston.createLogger({
	level: "debug",

	format: createFormat(true),
	defaultMeta: { env: getSecret("NODE_ENV") },
	transports: [
		new winston.transports.Console({
			format: winston.format.colorize({ all: true }),
		}),
		new winston.transports.File({
			filename: getFilename("error"),
			level: "error",
			format: createFormat(true),
		}),
		new winston.transports.File({
			filename: getFilename("combined"),
			level: "debug",
			format: createFormat(true),
		}),
	],
	exceptionHandlers: [
		new winston.transports.Console({
			format: winston.format.colorize({ all: true }),
		}),
		new winston.transports.File({
			filename: getFilename("exceptions"),
			format: createFormat(true),
		}),
	],
	rejectionHandlers: [
		new winston.transports.Console({
			format: winston.format.colorize({ all: true }),
		}),
		new winston.transports.File({
			filename: getFilename("rejections"),
			format: createFormat(true),
		}),
	],
});

logger.verbose({
	message: "Logger successfully setup!",
	service: "logger",
});

export default logger;
