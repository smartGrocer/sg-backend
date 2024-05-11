import { IProductProps } from "../../../../common/types/common/product";
import { LoblawsChainName } from "../../../../common/types/loblaws/loblaws";
import getProductsFromPage from "./getProductsFromPage";
import cleanLoblawsData from "./cleanLoblawsData";

import extractProductData, {
	IExtractProductDataProps,
} from "./extractProductData";
import { writeToDb } from "../../../../common/db/writeToDB";
import pickStore from "../common/pickRandomStore";
import sleep from "../../../../common/helpers/sleep";
import logger from "../../../../common/logging/axiom";

interface IScrapeLoblawsArgs {
	store_num: string;
	chainName: LoblawsChainName;
}

const scrapeStore = async ({
	chainName,
	store_num,
}: IScrapeLoblawsArgs): Promise<IProductProps[] | Error> => {
	try {
		const AllProducts: IProductProps[] = [];

		logger.info({
			message: `Scraping ${chainName} ${store_num}`,
			service: "scrapper",
		});
		const initialResponse = await getProductsFromPage({
			page: 1,
			store_num,
			chainName,
		});
		if (initialResponse instanceof Error) {
			return initialResponse;
		}

		const initialData = cleanLoblawsData(
			initialResponse?.data
		) as IExtractProductDataProps;
		const initialProducts = extractProductData(
			initialData,
			chainName,
			store_num
		);
		AllProducts.push(...(initialProducts || []));

		const totalResults = initialData?.pagination?.totalResults;
		const pageSize = initialData?.pagination?.pageSize;

		const totalPages = Math.ceil(totalResults / pageSize);

		const { upsertedCount, modifiedCount } =
			await writeToDb(initialProducts);

		logger.info({
			message: `Scraped ${chainName} pg 1 | Added:${upsertedCount}| Modified:${modifiedCount} | Total: ${AllProducts.length} products`,
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
				chainName,
			});

			if (response instanceof Error) {
				logger.error({
					message: `Error fetching ${chainName} ${store_num} pg ${page}`,
					error: response.toString(),
				});
				return response;
			}

			const cleanData = cleanLoblawsData(
				response.data
			) as IExtractProductDataProps;

			const data = extractProductData(cleanData, chainName, store_num);

			AllProducts.push(...(data || []));

			const {
				upsertedCount: upsertedCountInitial,
				modifiedCount: modifiedCountInitial,
			} = await writeToDb(data);
			const endTime = new Date().getTime();

			logger.info({
				message: `Scraped ${chainName} ${store_num} pg ${page}/${totalPages}| Added:${upsertedCountInitial}| Modified:${modifiedCountInitial} | Total: ${AllProducts.length} products | ${
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
			message: `Error scraping ${chainName} ${store_num}`,
			error: e?.toString(),
		});
		return e as Error;
	}
};

const scrapeLoblaws = async (
	chainName: LoblawsChainName
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
			error: e?.toString(),
		});
		return e as Error;
	}
};

export default scrapeLoblaws;
