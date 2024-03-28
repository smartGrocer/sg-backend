import {
	IProductProps,
	PandaBrowserKeys,
} from "../../../../common/types/common/product";
import { IGetProductMetroProps } from "../../../../common/types/metro/metro";

import * as cheerio from "cheerio";
import parseQuantity from "../../../../common/helpers/parseQuantity";
import {
	getCachedData,
	saveToCache,
} from "../../../../common/cache/storeCache";
import usePandaBrowser from "../../../../common/helpers/usePandaBrowser";

const getProduct = async ({
	product_id,
	url,
	store_id,
	chainName,
}: IGetProductMetroProps): Promise<IProductProps | Error> => {
	let productData: IProductProps[] = [];

	try {
		const cacheKey = `product-${chainName}-${store_id}-${product_id}-${url}`;

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

		$(".product-info").each((i, el) => {
			const product_id = $(el).attr("data-product-code") || "";
			const store_id = "all";

			const product_brand =
				$(el).find(".head__brand").text().trim() || "";

			const product_name = $(el).find(".head__title").text().trim() || "";

			const link_to_product =
				$(el).find(".product-details-link").attr("href") || "";
			const product_link =
				`https://www.${
					chainName === "metro" ? "metro.ca" : "foodbasics.ca"
				}${link_to_product}` || "";
			const product_image =
				$(el)
					.find(".pt__visual")
					.children()
					.find("picture.defaultable-picture source")
					.attr("srcset")
					?.split(",")[0] || "";

			const product_size =
				$(el).find(".head__unit-details").text().trim() || "";

			const product_size_quantity =
				parseQuantity(product_size).quantity || 0;
			const product_size_unit = parseQuantity(product_size).unit || "";

			const price =
				Number(
					$(el).find(".price-update").text().trim().split("$")[1]
				) || 0;

			// if there are 2 .price-update
			const has2Prices = $(el).find(".price-update").length > 1;
			// remove the word "avg." if it exists
			const price_unit = has2Prices
				? $(el)
						.find(".pricing__sale-price")
						.children()
						.first()
						.text()
						.trim()
						.split("/")[0]
						.trim()
						.replace(/^/, "for ")
				: $(el)
						.find(".pricing__sale-price")
						.children()
						.next()
						.text()
						.trim()
						.replace("avg.", "");

			const price_was_price_unit =
				$(el)
					.find(".pricing__before-price")
					.children()
					.next()
					.text()
					.trim()
					.split("$")[1] || 0;

			const price_was =
				Number(
					price_was_price_unit === 0
						? null
						: parseQuantity(price_was_price_unit).quantity
				) || null;

			const price_was_unit =
				price_was_price_unit === 0
					? null
					: parseQuantity(price_was_price_unit).unit || null;

			let compare_pricing_parent = $(el).find(
				".pricing__secondary-price"
			);
			const compare_price_first =
				compare_pricing_parent.children().first().text().trim() || "";

			const compare_price_split = compare_price_first.includes("/")
				? compare_price_first.split("/")
				: compare_pricing_parent.children().next().text().trim() || "";

			const compare_price =
				Number(compare_price_split[0].trim().split("$")[1].trim()) ||
				null;

			const compare_price_unit_quantity =
				compare_price_split[1].trim() || "";

			const compare_price_unit =
				parseQuantity(compare_price_unit_quantity).unit || null;
			const compare_price_quantity =
				parseQuantity(compare_price_unit_quantity).quantity || null;

			const unit_soldby_type =
				$(el).find(".unit-update")?.text()?.trim() || "ea.";

			const unit_soldby_unit =
				unit_soldby_type === "ea." ? "ea." : "pack";

			productData.push({
				product_id,
				store_id,
				chainName,
				product_brand,
				product_name,
				product_link,
				product_image,
				product_size_unit,
				product_size_quantity,
				unit_soldby_type,
				unit_soldby_unit,
				price,
				price_unit,
				price_was,
				price_was_unit,
				compare_price,
				compare_price_unit,
				compare_price_quantity,
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
		console.log({ error });
		return error as Error;
	}
};

export default getProduct;
