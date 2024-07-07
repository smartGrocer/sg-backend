import winston from "winston";
import getSecret from "../helpers/getSecret";

const logFormat = winston.format.printf(
	({ timestamp, level, message, service, error }) => {
		return `${timestamp} ${
			service ? `[${service}]` : ""
		} ${level}: ${message} ${error ? `: ${error.stack}` : ""}`;
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

const ConsoleTransport = (): winston.transports.ConsoleTransportInstance => {
	return new winston.transports.Console({
		format: winston.format.colorize({ all: true }),
	});
};

const FileTransport = ({
	filename,
	level,
}: {
	filename: string;
	level?: string;
}): winston.transports.FileTransportInstance => {
	return new winston.transports.File({
		filename,
		level,
		format: createFormat(true),
	});
};

const logger = winston.createLogger({
	level: "debug",

	format: createFormat(true),
	defaultMeta: { env: getSecret("NODE_ENV") },
	transports: [
		ConsoleTransport(),
		FileTransport({ filename: getFilename("error"), level: "error" }),
		FileTransport({ filename: getFilename("combined"), level: "debug" }),
	],
	exceptionHandlers: [
		ConsoleTransport(),
		FileTransport({ filename: getFilename("exceptions") }),
	],
	rejectionHandlers: [
		ConsoleTransport(),
		FileTransport({ filename: getFilename("rejections") }),
	],
});

logger.verbose({
	message: "Logger successfully setup!",
	service: "logger",
});

export default logger;
