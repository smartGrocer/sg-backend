import * as cheerio from "cheerio";
// eslint-disable-next-line import/no-cycle
import {
	IProductProps,
	PandaBrowserKeys,
} from "../../../../common/types/common/product";
import { IGetProductMetroProps } from "../../../../common/types/metro/metro";
import parseQuantity from "../../../../common/helpers/parseQuantity";
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

			const compare_pricing_parent = $(el).find(
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
		return error as Error;
	}
};

export default getProduct;
