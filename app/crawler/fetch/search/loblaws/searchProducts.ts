import axios from "axios";
import {
	ILoblawsProductSrcProps,
	LoblawsChainAlternateName,
	LoblawsChainName,
	pickImage,
} from "../../../../common/types/loblaws/loblaws";
import UserAgent from "user-agents";
import {
	IProductProps,
	IProductPropsWithPagination,
	ISearchProducts,
} from "../../../../common/types/common/product";
import { parse } from "dotenv";
import parseQuantity from "../../../../common/helpers/parseQuantity";
import {
	getCachedData,
	saveToCache,
} from "../../../../common/cache/storeCache";

const searchProducts = async ({
	search_term,
	chainName,
	store_id,
}: ISearchProducts): Promise<IProductPropsWithPagination | Error> => {
	try {
		const cacheKey = `search-${chainName}-${store_id}-${search_term}`;
		const cachedData = await getCachedData(cacheKey);

		if (cachedData) {
			return cachedData;
		}
		const userAgent = new UserAgent().toString();

		const url = `https://api.pcexpress.ca/pcx-bff/api/v1/products/search`;
		const storeId = store_id;
		const headers = {
			"x-apikey": "C1xujSegT5j3ap3yexJjqhOfELwGKYvz",
			"Content-Type": "application/json",
			"user-agent": userAgent,
		};
		const body = {
			pagination: { from: 0, size: 299 },
			banner: chainName,
			cartId: "02b57421-adcd-42a0-8af0-16514f0b9e0d",
			lang: "en",
			storeId: storeId,
			pickupType: "STORE",
			offerType: "ALL",
			term: search_term,
		};

		const response = await axios.post(url, body, { headers });

		const products = response.data.results.map(
			(product: ILoblawsProductSrcProps): IProductProps => {
				return {
					product_id: product.code,
					store_id: storeId,
					chainName: chainName,
					product_brand: product.brand,
					product_name: product.name,
					product_link: `https://www.${LoblawsChainAlternateName(chainName as LoblawsChainName)}.ca${product.link}`,
					product_image: pickImage(product.imageAssets),
					product_size_unit: parseQuantity(product.packageSize).unit,
					product_size_quantity: parseQuantity(product.packageSize)
						.quantity,
					unit_soldby_type: product.pricingUnits.type,
					unit_soldby_unit: product.pricingUnits.unit,
					price: product.prices.price.value,
					price_unit: product.prices.price.unit,
					price_was: product.prices?.wasPrice?.value || null,
					price_was_unit: product.prices?.wasPrice?.unit || null,
					compare_price:
						product.prices?.comparisonPrices[0]?.value || null,
					compare_price_unit:
						product.prices?.comparisonPrices[0]?.unit || null,
					compare_price_quantity:
						product.prices?.comparisonPrices[0]?.quantity || null,
				};
			}
		);

		const pagination = {
			totalResults: response.data.pagination.totalResults,
			pageNumber: response.data.pagination.pageNumber,
			pageSize: response.data.pagination.pageSize,
			totalPages: Math.ceil(
				response.data.pagination.totalResults /
					response.data.pagination.pageSize
			),
		};

		// save to cache
		await saveToCache({
			key: cacheKey,
			data: {
				pagination,
				results: products,
			},
			cacheInRedis: !cachedData,
		});

		return {
			pagination,
			results: products,
		};
	} catch (error: unknown) {
		return error as Error;
	}
};

export default searchProducts;
