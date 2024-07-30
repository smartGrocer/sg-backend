import { IProductProps } from "../../../../common/types/common/product";
import { LoblawsFlagName } from "../../../../common/types/loblaws/loblaws";
import getProductsFromPage from "./getProductsFromPage";
import cleanLoblawsData from "./cleanLoblawsData";

import extractProductData, {
	IExtractProductDataProps,
} from "./extractProductData";
import { writeToDb } from "../../../../common/db/writeToDB";
import pickStore from "../common/pickRandomStore";
import sleep from "../../../../common/helpers/sleep";
import logger from "../../../../common/logging/logger";

interface IScrapeLoblawsArgs {
	store_num: string;
	flagName: LoblawsFlagName;
}

const scrapeStore = async ({
	flagName,
	store_num,
}: IScrapeLoblawsArgs): Promise<IProductProps[] | Error> => {
	try {
		const AllProducts: IProductProps[] = [];

		logger.info({
			message: `Scraping ${flagName} ${store_num}`,
			service: "scrapper",
		});
		const initialResponse = await getProductsFromPage({
			page: 1,
			store_num,
			flagName,
		});
		if (initialResponse instanceof Error) {
			return initialResponse;
		}

		const initialData = cleanLoblawsData(
			initialResponse?.data
		) as IExtractProductDataProps;
		const initialProducts = extractProductData(
			initialData,
			flagName,
			store_num
		);
		AllProducts.push(...(initialProducts || []));

		const totalResults = initialData?.pagination?.totalResults;
		const pageSize = initialData?.pagination?.pageSize;

		const totalPages = Math.ceil(totalResults / pageSize);

		const { upsertedCount, modifiedCount } =
			await writeToDb(initialProducts);

		logger.info({
			message: `Scraped ${flagName} pg 1 | Added:${upsertedCount}| Modified:${modifiedCount} | Total: ${AllProducts.length} products`,
			service: "scrapper",
		});
		await sleep({ min: 20, max: 35 });

		for await (const page of Array.from({ length: totalPages }).map(
			(_, i) => i + 2
		)) {
			const time_start = new Date().getTime();
			const response = await getProductsFromPage({
				page,
				store_num,
				flagName,
			});

			if (response instanceof Error) {
				logger.error({
					message: `Error fetching ${flagName} ${store_num} pg ${page}`,
					error: response?.message,
					service: "scrapper",
				});
				return response;
			}

			const cleanData = cleanLoblawsData(
				response.data
			) as IExtractProductDataProps;

			const data = extractProductData(cleanData, flagName, store_num);

			AllProducts.push(...(data || []));

			const {
				upsertedCount: upsertedCountInitial,
				modifiedCount: modifiedCountInitial,
			} = await writeToDb(data);
			const endTime = new Date().getTime();

			logger.info({
				message: `Scraped ${flagName} ${store_num} pg ${page}/${totalPages}| Added:${upsertedCountInitial}| Modified:${modifiedCountInitial} | Total: ${AllProducts.length} products | ${
					(endTime - time_start) / 1000
				}s`,
				service: "scrapper",
			});

			// sleep for a random amount of time between 30s and 120s
			await sleep({ min: 20, max: 35 });
		}

		return AllProducts;
	} catch (e) {
		logger.error({
			message: `Error scraping ${flagName} ${store_num}`,
			error: e,
			service: "scrapper",
		});
		return e as Error;
	}
};

const scrapeLoblaws = async (
	flagName: LoblawsFlagName
): Promise<IProductProps[] | Error> => {
	try {
		const store_num = await pickStore(flagName);

		if (store_num instanceof Error || !store_num) {
			throw new Error(`Error picking store ${store_num}`);
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

export default scrapeLoblaws;
