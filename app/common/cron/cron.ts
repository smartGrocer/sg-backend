// const { CronJob } = require("cron");
import { CronJob } from "cron";
import { LoblawsChainName } from "../types/loblaws/loblaws";
import scrapeLoblaws from "../../crawler/fetch/crawl/loblaws/scrapeLoblaws";
import { MetroChain } from "../types/metro/metro";
import scrapeMetro from "../../crawler/fetch/crawl/metro/scrapeMetro";
import logger from "../logging/axiom";

const scheduleCron = (): void => {
	logger.info({
		message: "Starting cron job",
		service: "cron",
	});

	const pastRunners: string[] = [];

	const runners = [
		"nofrills",
		"loblaw",
		"superstore",
		"wholesaleclub",
		"valumart",
		"fortinos",

		// ...Object.values(LoblawsChainName),

		"metro",
		"foodbasics",
	];

	const job = new CronJob(
		// run the cron job every 6 hours
		"0 0 */6 * * *",
		async () => {
			const randomRunners = runners.sort(() => Math.random() - 0.5);

			// run a runner that hasn't been run in the past interval, and then add it to pastRunners
			// if all runners have been run, reset pastRunners
			for await (const runner of randomRunners) {
				if (!pastRunners.includes(runner)) {
					logger.info({
						message: `Running cron job for ${runner}`,
						service: "cron",
					});
					pastRunners.push(runner);

					// if runner was in LoblawsChainName
					if (
						Object.values(LoblawsChainName).includes(
							runner as LoblawsChainName
						)
					) {
						// run the loblaws runner
						await scrapeLoblaws(runner as LoblawsChainName);
					}

					if (
						Object.values(MetroChain).includes(runner as MetroChain)
					) {
						// run the metro runner
						await scrapeMetro(runner as MetroChain);
					}

					break;
				} else if (pastRunners.length === runners.length) {
					logger.info({
						message: "Resetting Runners",
						service: "cron",
					});
					pastRunners.length = 0;
					break;
				}
			}
		},
		null,
		true,
		"America/New_York"
	);

	job.start();
};

export default scheduleCron;
