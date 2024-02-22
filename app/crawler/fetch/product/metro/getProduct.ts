import UserAgent from "user-agents";
import { IProductProps } from "../../../../common/types/common/product";
import { IGetProductMetroProps } from "../../../../common/types/metro/metro";
import axios from "axios";
import * as cheerio from "cheerio";

const getProduct = async ({
	url,
	store_id,
	chainName,
}: IGetProductMetroProps): Promise<IProductProps | Error> => {
	const productData = {} as IProductProps;
	const userAgent = new UserAgent().toString();

	try {
		// fetch product data
		const response = await axios.get(url as string);
		const product = response.data;

		// parse product data
		const cleanData = product.replace(/\n|\r|\t/g, "");
		const $ = cheerio.load(cleanData);

		$(".productListCode").each((i, el) => {
			productData.product_id =
				$(el).find("itemprops").text().trim() || "";

			productData.store_id = store_id;

			productData.chainName = chainName;

			productData.product_brand =
				$(el).find(".brand").text().trim() || "";
		});

		// return product data
		return productData;
	} catch (error: unknown) {
		return error as Error;
	}
};

export default getProduct;
