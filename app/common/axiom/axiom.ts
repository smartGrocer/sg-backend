import winston from "winston";
import { WinstonTransport as AxiomTransport } from "@axiomhq/winston";

import getSecret from "../helpers/getSecret";

const logger = winston.createLogger({
	level: "info",
	format: winston.format.json(),
	defaultMeta: {
		service: "sg-backend",
		env: `${getSecret("NODE_ENV")}` || "test",
	},
	transports: [
		new AxiomTransport({
			token: `${getSecret("AXIOM_TOKEN")}`,
			dataset: `${getSecret("AXIOM_DATASET")}`,
		}),
	],
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
	type: "general",
});

export default logger;
