/**
 * 1. Find products in mongodb that do not have a description field
 * 2. For each product, fetch the product page and scrape the description
 * 3. Update the product in mongodb with the description
 */

import Product from "../../../../common/db/schema/product";
import sleep from "../../../../common/helpers/sleep";
import logger from "../../../../common/logging/logger";
import { IProductData } from "../../../../common/types/common/product";
import { MetroChain } from "../../../../common/types/metro/metro";
import getProduct from "../../product/metro/getProduct";

const scrapeAllProductsMetro = async ({
	chainName,
}: {
	chainName: MetroChain;
}): Promise<void> => {
	await sleep({ min: 15, max: 35 });
	const start_time = new Date().getTime();

	// eslint-disable-next-line no-use-before-define
	const product = await findProductMetro({ chainName });

	if (!product) {
		logger.info({
			message: `No products found for ${chainName} | Time: ${
				(new Date().getTime() - start_time) / 1000
			} s`,
			service: "scrapper",
		});
		return;
	}

	// fetch product page and scrape description
	const productData = await getProduct({
		product_num: product.product_num,
		url: product.product_link,
		store_num: product.chain_brand,
		chainName,
	});

	if (productData instanceof Error) {
		logger.error({
			message: `Error fetching product ${product.product_num} at ${product.chain_brand} | Time: ${
				(new Date().getTime() - start_time) / 1000
			} s`,
			error: productData,
		});

		// eslint-disable-next-line consistent-return
		await scrapeAllProductsMetro({ chainName }); // Retry with next product
		return;
	}

	// if productData starts with "Product number: " then don't save to db
	if (
		productData.description
			.toLowerCase()
			.startsWith("Product number: ".toLowerCase())
	) {
		productData.description = "";
	}

	// update product in mongodb with description and updatedAt
	await Product.findOneAndUpdate(
		{
			product_num: product.product_num,
			chain_brand: product.chain_brand,
		},
		{
			$set: {
				description: productData.description,
				updatedAt: new Date(),
			},
		},
		{
			upsert: false,
		}
	);

	logger.info({
		message: `Product description updated for ${product.product_num} at ${product.chain_brand} | Time: ${
			(new Date().getTime() - start_time) / 1000
		} s`,
		service: "scrapper",
	});
	// Continue scraping for more products
	await scrapeAllProductsMetro({ chainName });
};

const findProductMetro = async ({
	chainName,
}: {
	chainName: string;
}): Promise<IProductData> => {
	// find random products in mongodb that do not have a description field or is an empty string

	const product = await Product.aggregate([
		{ $match: { chain_brand: chainName, description: { $exists: false } } },
		{ $sample: { size: 1 } },
	]);

	return product[0];
};

export default scrapeAllProductsMetro;
