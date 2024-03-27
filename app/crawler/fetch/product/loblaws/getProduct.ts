import UserAgent from "user-agents";
import { IProductProps } from "../../../../common/types/common/product";
import axios from "axios";
import {
	IGetProductLoblawsProps,
	LoblawsChainAlternateName,
	LoblawsChainName,
	pickImage,
} from "../../../../common/types/loblaws/loblaws";
import parseQuantity from "../../../../common/helpers/parseQuantity";
import {
	getCachedData,
	saveToCache,
} from "../../../../common/cache/storeCache";

const getProduct = async ({
	product_id,
	store_id,
	chainName,
}: IGetProductLoblawsProps): Promise<IProductProps | Error> => {
	const cacheKey = `product-${chainName}-${store_id}-${product_id}`;

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

	const url_get = `https://api.pcexpress.ca/pcx-bff/api/v1/products/${product_id}?lang=en&date=${date}&pickupType=STORE&storeId=${store_id}&banner=${chainName}`;

	const headers = {
		"x-apikey": "C1xujSegT5j3ap3yexJjqhOfELwGKYvz",
		"Content-Type": "application/json",
		"user-agent": userAgent,
	};

	try {
		const response = await axios.get(url_get, { headers });

		const product = response.data;

		productData.product_id = product.code;
		productData.store_id = store_id;
		productData.chainName = chainName;
		productData.product_brand = product.brand;
		productData.product_name = product.name;
		productData.product_link = `https://www.${LoblawsChainAlternateName(chainName as LoblawsChainName)}.ca${product.link}`;
		productData.product_image = pickImage(product.imageAssets);
		productData.product_size_unit = parseQuantity(product.packageSize).unit;
		productData.product_size_quantity = parseQuantity(
			product.packageSize
		).quantity;
		productData.unit_soldby_type = product.pricingUnits.type;
		productData.unit_soldby_unit = product.pricingUnits.unit;
		productData.price = product.offers[0].price.value || null;
		productData.price_unit = product.offers[0].price.unit || null;
		productData.price_was = product.offers[0]?.priceWas?.value || null;
		productData.price_was_unit = product.offers[0]?.priceWas?.unit || null;
		productData.compare_price =
			product.offers[0].comparisonPrices[0].value || null;
		productData.compare_price_unit =
			product.offers[0].comparisonPrices[0].unit || null;
		productData.compare_price_quantity =
			product.offers[0].comparisonPrices[0].quantity || null;

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
