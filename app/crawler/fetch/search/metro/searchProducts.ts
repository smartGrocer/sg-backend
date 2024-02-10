import axios from "axios";
import * as cheerio from "cheerio";
import {
	IProductProps,
	ISearchProducts,
} from "../../../../common/types/common/product";

const searchProducts = async ({
	search_term,
	chainName,
	store_id,
}: ISearchProducts): Promise<IProductProps[] | Error> => {
	try {
		const url = `https://www.foodbasics.ca/search?filter=eggs`;
		const response = await axios.get(url);
		const resData = response.data;

		const cleanData = resData.replace(/\n|\r|\t/g, "");

		const $ = cheerio.load(cleanData);
		const data = [] as IProductProps[];

		$(".searchOnlineResults")
			.find("div.tile-product")
			.each((i, el) => {
				const product_id = $(el).attr("data-product-code") || "";
				const store_id = "";

				const product_brand =
					$(el).find(".head__brand").text().trim() || "";
				const product_name =
					$(el).find(".head__title").text().trim() || "";
				const product_link =
					$(el).find(".product-details-link").attr("href") || "";
				const product_image =
					$(el)
						.find(".pt__visual")
						.children()
						.find("picture.defaultable-picture source")
						.attr("srcset")
						?.split(",")[0] || "";

				const product_size =
					$(el).find(".head__unit-details").text().trim() || "";
				const unit_soldby_type =
					$(el).find(".address--line2").text().trim() || "";
				const unit_soldby_unit =
					$(el).find(".address--line2").text().trim() || "";

				const price =
					Number(
						$(el).find(".price-update").text().trim().split("$")
					) || 0;

				const price_unit =
					$(el)
						.find(".pricing__sale-price")
						.children()
						.find("abbr")
						.text()
						.trim() || "";

				const price_was =
					Number($(el).find(".address--line2").text().trim()) || 0;
				const price_was_unit =
					$(el).find(".address--line2").text().trim() || "";

                const compare_pricing_parent= $(el).find(".pricing__secondary-price")
				const compare_price =
					compare_pricing_parent[0] || 0;

                
				const compare_price_unit =
					$(el).find(".address--line2").text().trim() || "";
				const compare_price_quantity =
					Number($(el).find(".address--line2").text().trim()) || 0;

				data.push({
					product_id,
					store_id,
					chainName,
					product_brand,
					product_name,
					product_link,
					product_image,
					product_size,
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

		return data;
	} catch (e) {
		throw new Error(`Error fetching products for metro: ${e}`);
	}
};

export default searchProducts;
