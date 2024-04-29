import { eq, and, desc } from "drizzle-orm";
import db from "./db";
import { Price, Product, Store, StoreProduct } from "./schema";
import { AllStoreChainBrands, IStoreProps } from "../types/common/store";
import {
	IPriceData,
	IProductData,
	IProductProps,
} from "../types/common/product";
import chunkedByStores from "../helpers/chunkedByStores";

interface IWriteStoreToDbReturn {
	message: string;
	count: number;
	writtenProducts?: number;
	writtenPrices?: number;
}

export const writeStoreToDb = async (
	stores: IStoreProps[]
): Promise<IWriteStoreToDbReturn> => {
	try {
		if (!stores.length) {
			return {
				message: "No stores to write to db",
				count: 0,
			};
		}
		const insertedStores = await db
			.insert(Store)
			.values(stores)
			.onConflictDoNothing();

		if (insertedStores instanceof Error) {
			return {
				message: insertedStores.message,
				count: 0,
			};
		}

		return {
			message: "Stores written to db",
			count: stores.length,
		};
	} catch (e) {
		console.error("Error writing store to db", e);
		return {
			message: "Error writing store to db",
			count: 0,
		};
	}
};

export const writeToDb = async (
	products: IProductProps[]
): Promise<IWriteStoreToDbReturn> => {
	try {
		if (!products.length) {
			return {
				message: "No products to write to db",
				count: 0,
			};
		}

		const chunkByStores = chunkedByStores(products);

		let temp_writtenProducts;
		let temp_writtenPrices;

		for await (const storeChunk of chunkByStores) {
			const existingStore = await db
				.select()
				.from(Store)
				.where(
					and(
						eq(Store.store_num, storeChunk[0].store_num),
						eq(Store.chain_brand, storeChunk[0].chain_brand)
					)
				)
				.limit(1);

			const productData: IProductData[] = products.map((product) => {
				return {
					storeId: existingStore[0]?.id,
					// chain_name: existingStore[0]?.chain_name,
					chain_brand: existingStore[0]
						?.chain_brand as AllStoreChainBrands,
					product_num: product.product_num,
					product_brand: product.product_brand,
					product_name: product.product_name,
					product_link: product.product_link,
					product_image: product.product_image,
					product_size_unit: product.product_size_unit,
					product_size_quantity: product.product_size_quantity,
					unit_soldby_type: product.unit_soldby_type,
					unit_soldby_unit: product.unit_soldby_unit,
				};
			});

			// eslint-disable-next-line no-use-before-define
			const { writtenProducts, writtenPrices } = await writeProductsToDb({
				productData,
				products,
			});

			temp_writtenProducts = writtenProducts || 0;
			temp_writtenPrices = writtenPrices || 0;
		}

		return {
			message: "Store and products written to db",
			count: products.length,
			writtenProducts: temp_writtenProducts,
			writtenPrices: temp_writtenPrices,
		};
	} catch (e) {
		console.error("Error writing products to db", e);
		return {
			message: "Error writing products to db",
			count: 0,
		};
	}
};

// take insertedProducts and priceData and make an array of arrays of priceData with priceData with productId, storeId but without product_num
const updatePriceData = async ({
	insertedProducts,
	products,
	storeId,
}: {
	insertedProducts: {
		id: number;
		product_num: string;
		chain_brand: string;
	}[];
	products: IProductProps[];
	storeId: number;
}): Promise<IPriceData[]> => {
	if (!insertedProducts.length) {
		throw new Error("No insertedProducts found");
	}

	if (insertedProducts.length > 1) {
		throw new Error("More than one insertedProducts found");
	}
	const currentInsertedProduct = insertedProducts[0];

	const currentProduct = products.find(
		(product) => product.product_num === currentInsertedProduct.product_num
	);

	if (!currentProduct) {
		throw new Error("No currentProduct found");
	}

	return [
		{
			productId: currentInsertedProduct.id,
			storeId,
			chain_brand: currentProduct.chain_brand,
			price: currentProduct.price,
			price_unit: currentProduct.price_unit,
			price_was: currentProduct.price_was,
			price_was_unit: currentProduct.price_was_unit,
			compare_price: currentProduct.compare_price,
			compare_price_unit: currentProduct.compare_price_unit,
			compare_price_quantity: currentProduct.compare_price_quantity,
		},
	];
};

const writeProductsToDb = async ({
	productData,
	products,
}: {
	productData: IProductData[];
	products: IProductProps[];
}): Promise<IWriteStoreToDbReturn> => {
	const writtenProducts = [];
	const writtenPrices = [];

	for await (const product of productData) {
		if (!product.storeId) {
			console.error("Error writing products to db, no storeId found");
			return {
				message: "Error writing products to db, no storeId found",
				count: 0,
			};
		}
		const existingProduct = await db
			.select({
				id: Product.id,
				product_num: Product.product_num,
				chain_brand: Product.chain_brand,
			})
			.from(Product)
			.where(
				and(
					eq(Product.chain_brand, product.chain_brand),
					eq(Product.product_num, product.product_num)
				)
			)
			.limit(1);

		let insertedProduct;
		if (!existingProduct.length) {
			insertedProduct = await db
				.insert(Product)
				.values(product)
				.returning({
					id: Product.id,
					product_num: Product.product_num,

					chain_brand: Product.chain_brand,
				})
				.onConflictDoNothing();
		}
		if (insertedProduct instanceof Error) {
			console.error("Error writing products to db", insertedProduct);
			return {
				message: insertedProduct.message,
				count: 0,
			};
		}
		const returnedProduct = insertedProduct || existingProduct;
		writtenProducts.push(returnedProduct);

		await db
			.insert(StoreProduct)
			.values({
				storeId: product.storeId,
				productId: returnedProduct[0].id,
			})
			.onConflictDoNothing();

		// eslint-disable-next-line no-use-before-define
		const updatedPriceData = await updatePriceData({
			insertedProducts: returnedProduct,
			products,
			storeId: product.storeId,
		});

		// Execute the query to get the latest price
		const latestPriceResult = await db
			.select()
			.from(Price)
			.where(
				and(
					eq(Price.productId, updatedPriceData[0].productId),
					eq(Price.chain_brand, updatedPriceData[0].chain_brand),
					eq(Price.storeId, updatedPriceData[0].storeId)
				)
			)
			.orderBy(desc(Price.createdAt))
			.limit(1)
			.execute();

		let insertedPrice;
		if (
			!latestPriceResult.length ||
			latestPriceResult[0].price !== updatedPriceData[0].price
		) {
			insertedPrice = await db.insert(Price).values(updatedPriceData);
			// .returning({
			// 	id: Price.id,
			// 	productId: Price.productId,
			// 	storeId: Price.storeId,
			// });
			// .onConflictDoNothing();
		}

		writtenPrices.push(insertedPrice);

		if (insertedPrice instanceof Error) {
			console.error("Error writing price to db", insertedPrice);
			return {
				message: insertedPrice.message,
				count: 0,
			};
		}
	}

	return {
		message: "Product and Price written to db",
		count: products.length,
		writtenProducts: writtenProducts.length,
		writtenPrices: writtenPrices.length,
	};
};
