import { IProductProps } from "../../../../common/types/common/product";
import { LoblawsChainName } from "../../../../common/types/loblaws/loblaws";
import getProductsFromPage from "./getProductsFromPage";
import cleanLoblawsData from "./cleanLoblawsData";

import extractProductData, {
	IExtractProductDataProps,
} from "./extractProductData";
import { writeToDb } from "../../../../common/db/writeToDB";
import Store from "../../../../common/db/schema/store";

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

		console.log({ scraping: `${chainName} ${store_num}` });
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

		for await (const page of Array.from({ length: totalPages }).map(
			(_, i) => i + 1
		)) {
			const time_start = new Date().getTime();
			const response = await getProductsFromPage({
				page,
				store_num,
				chainName,
			});

			if (response instanceof Error) {
				console.error(response);
				return response;
			}

			const cleanData = cleanLoblawsData(
				response.data
			) as IExtractProductDataProps;

			const data = extractProductData(cleanData, chainName, store_num);

			// console.log({ sample: data[0] });
			AllProducts.push(...(data || []));

			const { upsertedCount, modifiedCount } = await writeToDb(data);

			console.log(
				`Scraped ${chainName} ${store_num} pg ${page}/${totalPages}| Added:${upsertedCount}| Modified:${modifiedCount} | Total: ${AllProducts.length} products | ${(new Date().getTime() - time_start) / 1000}s`
			);
			// // sleep for 5 seconds
			// await new Promise((resolve) => {
			// 	setTimeout(resolve, 10000);
			// });
		}

		return AllProducts;
	} catch (e) {
		console.error(e);
		return e as Error;
	}
};

const pickStore = async (
	chainName: LoblawsChainName
): Promise<string | Error> => {
	// pick random store from db based on chainName
	try {
		const randomStore = await Store.aggregate([
			{ $match: { chain_name: chainName, scrape: true } },
			{ $sample: { size: 1 } },
		]);

		if (!randomStore) {
			return new Error("Error picking store");
		}
		const store = randomStore[0]?.store_num;

		if (!store) {
			return new Error("No store found");
		}
		console.log({ store });
		return store;
	} catch (e) {
		console.error(e);
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
		console.error(e);
		return e as Error;
	}
};

export default scrapeLoblaws;
