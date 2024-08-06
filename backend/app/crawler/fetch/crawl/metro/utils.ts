import { writeToDb } from "../../../../common/db/writeToDB";
import cleanAndExtractMetroData from "../../../../common/helpers/cleanAndExtractMetroData";
import usePandaBrowser from "../../../../common/helpers/usePandaBrowser";
import logger from "../../../../common/logging/logger";
import {
	IProductProps,
	PandaBrowserKeys,
} from "../../../../common/types/common/product";
import { MetroFlags } from "../../../../common/types/metro/metro";

const urlPage = ({
	flagName,
	page,
}: {
	flagName: MetroFlags;
	page: number;
}): string => {
	return `https://www.${flagName === "metro" ? "metro.ca/en/online-grocery" : "foodbasics.ca"}/search-page-${page}`;
};

const processMetroScrapper = async (
	page: number,
	flagName: MetroFlags,
	AllProducts: IProductProps[],
	store_num: string
): Promise<{ page_results: number }> => {
	const time_start = new Date().getTime();

	const url = urlPage({ flagName, page });

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

	const { upsertedCount, modifiedCount } = await writeToDb(data);

	const endTime = new Date().getTime();

	logger.info({
		message: `Scraped ${flagName} pg ${page}/${page_results} | Added:${upsertedCount}| Modified:${modifiedCount} | Total: ${AllProducts.length} products | ${
			(endTime - time_start) / 1000
		}s`,
		service: "scrapper",
	});

	return {
		page_results,
	};
};

export default processMetroScrapper;
