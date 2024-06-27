import usePandaBrowser from "../../../../common/helpers/usePandaBrowser";
import {
	IProductProps,
	PandaBrowserKeys,
} from "../../../../common/types/common/product";
import { MetroChain } from "../../../../common/types/metro/metro";
import pickStore from "../common/pickRandomStore";
import cleanAndExtractMetroData from "../../../../common/helpers/cleanAndExtractMetroData";
import sleep from "../../../../common/helpers/sleep";
import { writeToDb } from "../../../../common/db/writeToDB";
import { AllStoreChainBrands } from "../../../../common/types/common/store";
import logger from "../../../../common/logging/logger";

interface IScrapeMetroArgs {
	store_num: string;
	chainName: MetroChain;
}
const urlPage = ({
	chainName,
	page,
}: {
	chainName: MetroChain;
	page: number;
}): string => {
	return `https://www.${chainName === "metro" ? "metro.ca/en/online-grocery" : "foodbasics.ca"}/search-page-${page}`;
};

const scrapeStore = async ({
	chainName,
}: IScrapeMetroArgs): Promise<IProductProps[] | Error> => {
	try {
		logger.info({
			message: `Scraping ${chainName}`,
			service: "scrapper",
		});
		const url = urlPage({ chainName, page: 1 });

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
			store_num:
				chainName === "metro"
					? AllStoreChainBrands.metro
					: AllStoreChainBrands.foodbasics,
			chainName,
		});

		AllProducts.push(...data);

		const {
			upsertedCount: upsertedCountInitial,
			modifiedCount: modifiedCountInitial,
		} = await writeToDb(data);

		logger.info({
			message: `Scraped ${chainName} pg 1 | Added:${upsertedCountInitial}| Modified:${modifiedCountInitial} | Total: ${AllProducts.length} products`,
			service: "scrapper",
		});

		await sleep({ min: 20, max: 35 });
		if (page_results > 1) {
			for await (const page of Array.from({
				length: page_results + 1,
			}).map((_, i) => i + 2)) {
				const time_start = new Date().getTime();
				const url_loop = urlPage({ chainName, page });

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
					store_num:
						chainName === "metro"
							? AllStoreChainBrands.metro
							: AllStoreChainBrands.foodbasics,
					chainName,
				});

				AllProducts.push(...data_loop);

				const { upsertedCount, modifiedCount } =
					await writeToDb(data_loop);
				const endTime = new Date().getTime();

				logger.info({
					message: `Scraped ${chainName} pg ${page}/${page_results} | Added:${upsertedCount}| Modified:${modifiedCount} | Total: ${AllProducts.length} products | ${
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
			message: `Error scraping ${chainName}`,
			error: e,
			service: "scrapper",
		});
		return e as Error;
	}
};

const scrapeMetro = async (
	chainName: MetroChain
): Promise<IProductProps[] | Error> => {
	try {
		const store_num = await pickStore(chainName);

		if (store_num instanceof Error || !store_num) {
			throw new Error("Error picking store");
		}

		const products = await scrapeStore({ chainName, store_num });

		if (products instanceof Error) {
			throw new Error("Error scraping store");
		}

		return products;
	} catch (e) {
		logger.error({
			message: `Error scraping ${chainName}`,
			error: e,
			service: "scrapper",
		});
		return e as Error;
	}
};

export default scrapeMetro;
