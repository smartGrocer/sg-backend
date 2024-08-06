import usePandaBrowser from "../../../../common/helpers/usePandaBrowser";
import {
	IProductProps,
	PandaBrowserKeys,
} from "../../../../common/types/common/product";
import { MetroFlags } from "../../../../common/types/metro/metro";
import pickStore from "../common/pickRandomStore";
import cleanAndExtractMetroData from "../../../../common/helpers/cleanAndExtractMetroData";
import sleep from "../../../../common/helpers/sleep";
import { writeToDb } from "../../../../common/db/writeToDB";
import logger from "../../../../common/logging/logger";

interface IScrapeMetroArgs {
	store_num: string;
	flagName: MetroFlags;
}
const urlPage = ({
	flagName,
	page,
}: {
	flagName: MetroFlags;
	page: number;
}): string => {
	return `https://www.${flagName === "metro" ? "metro.ca/en/online-grocery" : "foodbasics.ca"}/search-page-${page}`;
};

const scrapeStore = async ({
	flagName,
	store_num,
}: IScrapeMetroArgs): Promise<IProductProps[] | Error> => {
	try {
		logger.info({
			message: `Scraping ${flagName} | Store: ${store_num}`,
			service: "scrapper",
		});
		const url = urlPage({ flagName, page: 1 });

		const AllProducts: IProductProps[] = [];

		const { response, resData } = await usePandaBrowser({
			url,
			key: PandaBrowserKeys.metro_crawl_panda,
		});

		if (response?.status === 500) {
			throw new Error(
				`Errors fetching products for metro, status: ${response.status}`
			);
		}

		const cleanData = resData.replace(/\n|\r|\t/g, "");

		const { products: data, page_results } = cleanAndExtractMetroData({
			data: cleanData,
			store_num,
			flagName,
		});

		AllProducts.push(...data);

		const {
			upsertedCount: upsertedCountInitial,
			modifiedCount: modifiedCountInitial,
		} = await writeToDb(data);

		logger.info({
			message: `Scraped ${flagName} pg 1 | Added:${upsertedCountInitial}| Modified:${modifiedCountInitial} | Total: ${AllProducts.length} products`,
			service: "scrapper",
		});

		await sleep({ min: 20, max: 35 });
		if (page_results > 1) {
			for await (const page of Array.from({
				length: page_results + 1,
			}).map((_, i) => i + 2)) {
				const time_start = new Date().getTime();
				const url_loop = urlPage({ flagName, page });

				const { response: response_loop, resData: resData_loop } =
					await usePandaBrowser({
						url: url_loop,
						key: PandaBrowserKeys.metro_crawl_panda,
					});

				if (response_loop?.status === 500) {
					throw new Error(
						`Errors fetching products for metro, status: ${response_loop.status}`
					);
				}

				const cleanData_loop = resData_loop.replace(/\n|\r|\t/g, "");

				const {
					products: data_loop,

					page_results: page_results_loop,
				} = cleanAndExtractMetroData({
					data: cleanData_loop,
					store_num,
					flagName,
				});

				AllProducts.push(...data_loop);

				const { upsertedCount, modifiedCount } =
					await writeToDb(data_loop);
				const endTime = new Date().getTime();

				logger.info({
					message: `Scraped ${flagName} pg ${page}/${page_results} | Added:${upsertedCount}| Modified:${modifiedCount} | Total: ${AllProducts.length} products | ${
						(endTime - time_start) / 1000
					}s`,
					service: "scrapper",
				});

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
