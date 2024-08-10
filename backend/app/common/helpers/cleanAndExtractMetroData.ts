import * as cheerio from "cheerio";
import { AllParentCompanyList } from "../types/common/store";
import { IProductProps } from "../types/common/product";

interface IExtractMetroDataReturn {
	products: IProductProps[];
	page_results: number;
}

const cleanAndExtractMetroData = ({
	data,
	store_num,
	flagName,
}: {
	data: string;
	store_num: string;
	flagName: string;
}): IExtractMetroDataReturn => {
	const $ = cheerio.load(data);
	const productData = [] as IProductProps[];
	const page_results = $(".products-tools").text().trim().split(" ")[0] || 0;
	$(".searchOnlineResults")
		.find("div.tile-product")
		.each((_i, el) => {
			const product_num = $(el).attr("data-product-code") || "";

			const product_brand =
				$(el).find(".head__brand").text().trim() || "";

			const product_name = $(el).find(".head__title").text().trim() || "";

			const link_to_product =
				$(el).find(".product-details-link").attr("href") || "";
			const product_link =
				`https://www.${
					flagName === "metro" ? "metro.ca" : "foodbasics.ca"
				}${link_to_product}` || "";
			const product_image =
				$(el)
					.find(".pt__visual")
					.children()
					.find("picture.defaultable-picture source")
					.attr("srcset")
					?.split(",")[0] || "";

			const price =
				Number(
					$(el).find(".price-update").text().trim().split("$")[1]
				) || 0;

			// description: find parent of class "pi--product-main-info__sku"
			const description =
				$(el)
					.find(".pi--product-main-info__sku")
					.parent()
					.children()
					.first()
					.text()
					.trim() || "";

			productData.push({
				product_num,
				store_num,
				flag_name: flagName,
				parent_company: AllParentCompanyList.metro,
				product_brand,
				product_name,
				product_link,
				product_image,
				description,
				price,
			});
		});

	return { products: productData, page_results: Number(page_results) };
};

export default cleanAndExtractMetroData;
