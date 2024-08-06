import { IProductProps } from "../../../../common/types/common/product";
import { MetroFlags } from "../../../../common/types/metro/metro";
import pickStore from "../common/pickRandomStore";
import sleep from "../../../../common/helpers/sleep";
import logger from "../../../../common/logging/logger";
import processMetroScrapper from "./utils";

interface IScrapeMetroArgs {
	store_num: string;
	flagName: MetroFlags;
}

const scrapeStore = async ({
	flagName,
	store_num,
}: IScrapeMetroArgs): Promise<IProductProps[] | Error> => {
	try {
		logger.info({
			message: `Scraping ${flagName} | Store: ${store_num}`,
			service: "scrapper",
		});
		const AllProducts: IProductProps[] = [];

		const { page_results } = await processMetroScrapper(
			1,
			flagName,
			AllProducts,
			store_num
		);

		await sleep({ min: 20, max: 35 });

		if (page_results > 1) {
			for await (const page of Array.from({
				length: page_results + 1,
			}).map((_, i) => i + 2)) {
				const { page_results: page_results_loop } =
					await processMetroScrapper(
						page,
						flagName,
						AllProducts,
						store_num
					);

				if (page_results_loop === 0) {
					break;
				}

				await sleep({ min: 20, max: 35 });
			}
		}

		return AllProducts;
	} catch (e) {
		logger.error({
			message: `Error scraping ${flagName}`,
			error: e,
			service: "scrapper",
		});
		return e as Error;
	}
};

const scrapeMetro = async (
	flagName: MetroFlags
): Promise<IProductProps[] | Error> => {
	try {
		const store_num = await pickStore(flagName);

		if (store_num instanceof Error || !store_num) {
			throw new Error("Error picking store");
		}

		const products = await scrapeStore({ flagName, store_num });

		if (products instanceof Error) {
			throw new Error("Error scraping store");
		}

		return products;
	} catch (e) {
		logger.error({
			message: `Error scraping ${flagName}`,
			error: e,
			service: "scrapper",
		});
		return e as Error;
	}
};

export default scrapeMetro;
