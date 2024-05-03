// const { CronJob } = require("cron");
import { CronJob } from "cron";
import { LoblawsChainName } from "../types/loblaws/loblaws";
import scrapeLoblaws from "../../crawler/fetch/crawl/loblaws/scrapeLoblaws";

const scheduleCron = (): void => {
	console.log("Starting cron job");

	const pastRunners: string[] = [];

	const runners = [
		"nofrills",
		"loblaw",
		"superstore",
		"wholesaleclub",
		"valumart",
		"fortinos",

		// ...Object.values(LoblawsChainName),
	];

	const job = new CronJob(
		// run the cron job every 12 hours
		"0 0 */12 * * *",
		async () => {
			const randomRunners = runners.sort(() => Math.random() - 0.5);

			// run a runner that hasn't been run in the past interval, and then add it to pastRunners
			// if all runners have been run, reset pastRunners
			for await (const runner of randomRunners) {
				if (!pastRunners.includes(runner)) {
					console.log(`Running ${runner}`);
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

					break;
				} else if (pastRunners.length === runners.length) {
					console.log("Resetting Runners");
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
