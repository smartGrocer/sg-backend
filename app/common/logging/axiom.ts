import winston from "winston";
import { WinstonTransport as AxiomTransport } from "@axiomhq/winston";
import getSecret from "../helpers/getSecret";

const { combine, errors, json } = winston.format;

const axiomTransport = new AxiomTransport({
	token: `${getSecret("AXIOM_TOKEN")}`,
	dataset: `${getSecret("AXIOM_DATASET")}`,
});
const logger = winston.createLogger({
	defaultMeta: {
		service: "sg-backend",
		env: `${getSecret("NODE_ENV")}` || "test",
	},
	format: combine(errors({ stack: true }), json()),
	transports: [axiomTransport],
	exceptionHandlers: [axiomTransport],
	rejectionHandlers: [axiomTransport],
});

if (getSecret("NODE_ENV") !== "production") {
	logger.add(
		new winston.transports.Console({
			format: winston.format.simple(),
		})
	);
}

logger.log({
	level: "info",
	message: "Logger successfully setup in axiom.ts",
});

export default logger;
