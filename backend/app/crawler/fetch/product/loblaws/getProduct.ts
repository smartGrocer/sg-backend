import axios from "axios";
import UserAgent from "user-agents";
import { IProductProps } from "../../../../common/types/common/product";
import {
	IGetProductLoblawsProps,
	LoblawsFlagAlternateName,
	LoblawsFlagName,
	pickImage,
} from "../../../../common/types/loblaws/loblaws";
import {
	getCachedData,
	saveToCache,
} from "../../../../common/cache/storeCache";
import { AllParentCompanyList } from "../../../../common/types/common/store";
import removeHtmlTags from "../../../../common/helpers/removeHtmlTags";

const getProduct = async ({
	product_num,
	store_num,
	flagName,
}: IGetProductLoblawsProps): Promise<IProductProps | Error> => {
	const cacheKey = `product-${flagName}-${store_num}-${product_num}`;

	const cachedData = await getCachedData({
		key: cacheKey,
		cacheInRedis: true,
	});

	if (cachedData) {
		return cachedData;
	}
	const productData = {} as IProductProps;
	const userAgent = new UserAgent().toString();
	// format date as ddmmyyyy in toronto
	const date = new Date()
		.toLocaleDateString("en-CA")
		.split("-")
		.reverse()
		.join("");

	const url_get = `https://api.pcexpress.ca/pcx-bff/api/v1/products/${product_num}?lang=en&date=${date}&pickupType=STORE&storeId=${store_num}&banner=${flagName}`;

	const headers = {
		"x-apikey": "C1xujSegT5j3ap3yexJjqhOfELwGKYvz",
		"Content-Type": "application/json",
		"user-agent": userAgent,
	};

	try {
		const response = await axios.get(url_get, { headers });

		const product = response.data;

		productData.product_num = product.code;
		productData.store_num = store_num;
		productData.flag_name = flagName;
		productData.parent_company = AllParentCompanyList.loblaws;
		productData.product_brand = product.brand;
		productData.product_name = product.name;
		productData.product_link = `https://www.${LoblawsFlagAlternateName(flagName as LoblawsFlagName)}.ca${product.link}`;
		productData.product_image = pickImage(product.imageAssets);
		productData.description = removeHtmlTags(product.description || "N/A");
		productData.price = product.offers[0].price.value || null;

		// cache data
		await saveToCache({
			key: cacheKey,
			data: productData,
			cacheInRedis: true,
		});

		return productData;
	} catch (error: unknown) {
		return error as Error;
	}
};

export default getProduct;
