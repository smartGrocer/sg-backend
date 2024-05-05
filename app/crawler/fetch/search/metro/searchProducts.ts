import {
	IProductProps,
	ISearchProducts,
	PandaBrowserKeys,
} from "../../../../common/types/common/product";

import usePandaBrowser from "../../../../common/helpers/usePandaBrowser";
import {
	getCachedData,
	saveToCache,
} from "../../../../common/cache/storeCache";
import cleanAndExtractMetroData from "./cleanAndExtractMetroData";
import { AllStoreChainBrands } from "../../../../common/types/common/store";

const searchProducts = async ({
	search_term,
	chainName,
}: ISearchProducts): Promise<IProductProps[] | Error> => {
	try {
		const store_num = "all";
		const cacheKey = `search-${chainName}-${store_num}-${search_term}`;

		const cachedData = await getCachedData({
			key: cacheKey,
			cacheInRedis: true,
		});

		if (cachedData) {
			return cachedData;
		}
		let url = `https://www.${chainName === "metro" ? "metro.ca/en/online-grocery" : "foodbasics.ca"}/search?filter=${search_term}`;

		if (chainName === "metro") {
			url += `&freeText=true`;
		}

		const { response, resData } = await usePandaBrowser({
			url,
			key: PandaBrowserKeys.metro_search_panda,
		});

		if (response?.status === 500) {
			throw new Error(
				`Errors fetching products for metro, status: ${response.status}`
			);
		}

		const cleanData = resData.replace(/\n|\r|\t/g, "");

		const { products: data } = cleanAndExtractMetroData({
			data: cleanData,
			store_num:
				chainName === "metro"
					? AllStoreChainBrands.metro
					: AllStoreChainBrands.foodbasics,
			chainName,
		});

		// save to cache
		await saveToCache({
			key: cacheKey,
			data,
			cacheInRedis: true,
		});

		return data;
	} catch (e) {
		console.log(`Error fetching products for metro: ${e}`);
		return e as Error;
	}
};

export default searchProducts;
