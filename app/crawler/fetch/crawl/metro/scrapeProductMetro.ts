/**
 * 1. Find products in mongodb that do not have a description field
 * 2. For each product, fetch the product page and scrape the description
 * 3. Update the product in mongodb with the description
 */

import Product from "../../../../common/db/schema/product";
import { writeToDb } from "../../../../common/db/writeToDB";
import { IProductData } from "../../../../common/types/common/product";
import { MetroChain } from "../../../../common/types/metro/metro";
import getProduct from "../../product/metro/getProduct";

const scrapeProductMetro = async ({ chainName }: { chainName: MetroChain }) => {
	let productsFound = true;

	console.log(`Scraping products for ${chainName}`);

	// eslint-disable-next-line no-use-before-define
	const product = await findProductMetro({ chainName });

	console.log(`Found product with description`, {
		product,
	});

	if (!product) {
		return;
	}

	// fetch product page and scrape description
	const productData = await getProduct({
		product_num: product.product_num,
		url: product.product_link,
		store_num: product.chain_brand,
		chainName,
	});

	console.log(`Product data`, productData);

	if (productData instanceof Error) {
		console.log(`Error fetching product`, productData);

		return;
	}

	// if productData starts with "Product number: " then dont save to db
	if (productData.description.startsWith("Product number: ")) {
		console.log(`Product description is empty`, productData);

		return;
	}

	await writeToDb([productData]);
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

export default scrapeProductMetro;
