import * as cheerio from "cheerio";
// eslint-disable-next-line import/no-cycle
import {
	IProductProps,
	PandaBrowserKeys,
} from "../../../../common/types/common/product";
import { IGetProductMetroProps } from "../../../../common/types/metro/metro";

import {
	getCachedData,
	saveToCache,
} from "../../../../common/cache/storeCache";
import usePandaBrowser from "../../../../common/helpers/usePandaBrowser";
import { AllParentCompanyList } from "../../../../common/types/common/store";

const getProduct = async ({
	product_num,
	url,
	store_num,
	flagName,
}: IGetProductMetroProps): Promise<IProductProps | Error> => {
	const productData: IProductProps[] = [];

	try {
		const cacheKey = `product-${flagName}-${store_num}-${product_num}-${url}`;

		const cachedData = await getCachedData({
			key: cacheKey,
			cacheInRedis: true,
		});

		if (cachedData) {
			return cachedData;
		}

		const { resData } = await usePandaBrowser({
			url: url as string,
			key: PandaBrowserKeys.metro_lookup_panda,
		});

		const product = resData;

		// parse product data
		const cleanData = product.replace(/\n|\r|\t/g, "");
		const $ = cheerio.load(cleanData);

		$(".product-info").each((_i, el) => {
			const product_id_2 = $(el).attr("data-product-code") || "";
			const store_id_2 = "all";

			const product_brand = $(el).find(".pi--brand").text().trim() || "";

			const product_name = $(el).find(".pi--title").text().trim() || "";

			const link_to_product = $(`span[itemprop="url"]`).text() || "";

			const product_link = link_to_product
				? `https://www.${
						flagName === "metro" ? "metro.ca" : "foodbasics.ca"
					}${link_to_product}`
				: "";
			const product_image =
				$(el)
					.find(".pdp-image")
					.children()
					.find("picture.defaultable-picture source")
					.attr("srcset")
					?.split(",")[0] || "";

			const price =
				Number(
					$(el).find(".price-update").text().trim().split("$")[1]
				) || 0;

			const description =
				$(el)
					.find(".pi--product-main-info__sku")
					.parent()
					.children()
					.first()
					.text()
					.trim() || "";

			productData.push({
				product_num: product_id_2,
				store_num: store_id_2,
				parent_company:
					flagName === "metro"
						? AllParentCompanyList.metro
						: AllParentCompanyList.foodbasics,
				flag_name: flagName,
				product_brand,
				product_name,
				product_link,
				product_image,
				description,
				price,
			});
		});

		const result = productData[0];

		// cache data
		await saveToCache({
			key: cacheKey,
			data: result,
			cacheInRedis: true,
		});

		return result;
	} catch (error: unknown) {
		return error as Error;
	}
};

export default getProduct;
