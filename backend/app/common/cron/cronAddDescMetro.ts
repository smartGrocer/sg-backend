import { CronJob } from "cron";
import scrapeProductMetro from "../../crawler/fetch/crawl/metro/scrapeProductMetro";
import getSecret from "../helpers/getSecret";
import { MetroFlags } from "../types/metro/metro";
import logger from "../logging/logger";

const cronAddDescMetro = async (): Promise<void> => {
	if (getSecret("RUN_METRO_DESC_CRON") === "true") {
		logger.info({
			message: "Starting cron job: cronAddDescMetro",
			service: "cron",
		});

		const runners = ["metro", "foodbasics"];

		for await (const runner of runners) {
			logger.info({
				message: `Running cron job: cronAddDescMetro for ${runner}`,
				service: "cron",
			});
			await scrapeProductMetro({
				flagName: runner as MetroFlags,
			});
		}

		const job = new CronJob(
			// run the cron job every 1 week
			"0 0 0 * * 0",
			async () => {
				for await (const runner of runners) {
					logger.info({
						message: `Running cron job: cronAddDescMetro for ${runner}`,
						service: "cron",
					});
					await scrapeProductMetro({
						flagName: runner as MetroFlags,
					});
				}
			},
			null,
			true
		);

		job.start();
	}
};

export default cronAddDescMetro;
