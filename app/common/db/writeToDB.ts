import { AnyBulkWriteOperation } from "mongoose";
import { IStoreProps } from "../types/common/store";
import { IProductProps } from "../types/common/product";

import Store from "./schema/store";
import Product from "./schema/product";

interface IWriteStoreToDbReturn {
	message: string;
	count: number;
	upsertedCount?: number;
	modifiedCount?: number;
}

// export const writeStoreToDb = async (
// 	stores: IStoreProps[]
// ): Promise<IWriteStoreToDbReturn> => {
// 	try {
// 		if (!stores.length) {
// 			return {
// 				message: "No stores to write to db",
// 				count: 0,
// 			};
// 		}
// 		const insertedStores = await db
// 			.insert(Store)
// 			.values(stores)
// 			.onConflictDoNothing();

// 		if (insertedStores instanceof Error) {
// 			return {
// 				message: insertedStores.message,
// 				count: 0,
// 			};
// 		}

// 		return {
// 			message: "Stores written to db",
// 			count: stores.length,
// 		};
// 	} catch (e) {
// 		console.error("Error writing store to db", e);
// 		return {
// 			message: "Error writing store to db",
// 			count: 0,
// 		};
// 	}
// };

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

		const bulkOperations = stores.map((store) => ({
			updateOne: {
				filter: {
					store_num: store.store_num,
					chain_brand: store.chain_brand,
				},
				update: {
					$setOnInsert: store,
				},
				upsert: true,
			},
		}));

		const insertedStores = await Store.bulkWrite(bulkOperations);

		if (insertedStores instanceof Error) {
			return {
				message: insertedStores.message,
				count: 0,
			};
		}
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { upsertedIds, ...logdata } = insertedStores;
		console.log("insertedStores", logdata);
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

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const bulkOperations: any[] = [];
		for await (const product of products) {
			const existingProduct = await Product.findOne({
				product_num: product.product_num,
			});
			const priceHistory: {
				store_num: string;
				date: Date;
				amount: number;
			}[] = existingProduct ? existingProduct.priceHistory : [];

			const currentStorePrices = priceHistory.filter(
				(price) => price.store_num === product.store_num
			);
			const latestPrice =
				currentStorePrices[currentStorePrices.length - 1];

			if (!latestPrice || latestPrice.amount !== product.price) {
				priceHistory.push({
					store_num: product.store_num,
					date: new Date(),
					amount: product.price,
				});
			}

			bulkOperations.push({
				updateOne: {
					filter: { product_num: product.product_num },
					update: {
						$set: { ...product, priceHistory },
						updatedAt: new Date(),
					},
					upsert: true,
				},
			});
		}

		const result = await Product.bulkWrite(
			bulkOperations as unknown as AnyBulkWriteOperation<IProductProps>[]
		);

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { upsertedCount, modifiedCount } = result;

		// sleep for 5 seconds
		await new Promise((resolve) => {
			setTimeout(resolve, 5000);
		});

		return {
			message: "Store and products written to db",
			count: products.length,
			upsertedCount: upsertedCount || 0,
			modifiedCount: modifiedCount || 0,
		};
	} catch (error) {
		console.error("Error writing products to db", error);
		return {
			message: "Error writing products to db",
			count: 0,
		};
	}
};

// take insertedProducts and priceData and make an array of arrays of priceData with priceData with productId, storeId but without product_num
// const updatePriceData = async ({
// 	insertedProducts,
// 	products,
// 	storeId,
// }: {
// 	insertedProducts: {
// 		id: number;
// 		product_num: string;
// 		chain_brand: string;
// 	}[];
// 	products: IProductProps[];
// 	storeId: number;
// }): Promise<IPriceData[]> => {
// 	if (!insertedProducts.length) {
// 		throw new Error("No insertedProducts found");
// 	}

// 	if (insertedProducts.length > 1) {
// 		throw new Error("More than one insertedProducts found");
// 	}
// 	const currentInsertedProduct = insertedProducts[0];

// 	const currentProduct = products.find(
// 		(product) => product.product_num === currentInsertedProduct.product_num
// 	);

// 	if (!currentProduct) {
// 		throw new Error("No currentProduct found");
// 	}

// 	return [
// 		{
// 			productId: currentInsertedProduct.id,
// 			storeId,
// 			chain_brand: currentProduct.chain_brand,
// 			price: currentProduct.price,
// 			price_unit: currentProduct.price_unit,
// 			price_was: currentProduct.price_was,
// 			price_was_unit: currentProduct.price_was_unit,
// 			compare_price: currentProduct.compare_price,
// 			compare_price_unit: currentProduct.compare_price_unit,
// 			compare_price_quantity: currentProduct.compare_price_quantity,
// 		},
// 	];
// };

// const writeProductsToDb = async ({
// 	productData,
// 	products,
// }: {
// 	productData: IProductData[];
// 	products: IProductProps[];
// }): Promise<IWriteStoreToDbReturn> => {
// 	const writtenProducts = [];
// 	const writtenPrices = [];

// 	for await (const product of productData) {
// 		if (!product.storeId) {
// 			console.error("Error writing products to db, no storeId found");
// 			return {
// 				message: "Error writing products to db, no storeId found",
// 				count: 0,
// 			};
// 		}
// 		const existingProduct = await db
// 			.select({
// 				id: Product.id,
// 				product_num: Product.product_num,
// 				chain_brand: Product.chain_brand,
// 			})
// 			.from(Product)
// 			.where(
// 				and(
// 					eq(Product.chain_brand, product.chain_brand),
// 					eq(Product.product_num, product.product_num)
// 				)
// 			)
// 			.limit(1);

// 		let insertedProduct;
// 		if (!existingProduct.length) {
// 			insertedProduct = await db
// 				.insert(Product)
// 				.values(product)
// 				.returning({
// 					id: Product.id,
// 					product_num: Product.product_num,

// 					chain_brand: Product.chain_brand,
// 				})
// 				.onConflictDoNothing();
// 		}
// 		if (insertedProduct instanceof Error) {
// 			console.error("Error writing products to db", insertedProduct);
// 			return {
// 				message: insertedProduct.message,
// 				count: 0,
// 			};
// 		}
// 		const returnedProduct = insertedProduct || existingProduct;
// 		writtenProducts.push(returnedProduct);

// 		await db
// 			.insert(StoreProduct)
// 			.values({
// 				storeId: product.storeId,
// 				productId: returnedProduct[0].id,
// 			})
// 			.onConflictDoNothing();

// 		// eslint-disable-next-line no-use-before-define
// 		const updatedPriceData = await updatePriceData({
// 			insertedProducts: returnedProduct,
// 			products,
// 			storeId: product.storeId,
// 		});

// 		// Execute the query to get the latest price
// 		const latestPriceResult = await db
// 			.select()
// 			.from(Price)
// 			.where(
// 				and(
// 					eq(Price.productId, updatedPriceData[0].productId),
// 					eq(Price.chain_brand, updatedPriceData[0].chain_brand),
// 					eq(Price.storeId, updatedPriceData[0].storeId)
// 				)
// 			)
// 			.orderBy(desc(Price.createdAt))
// 			.limit(1)
// 			.execute();

// 		let insertedPrice;
// 		if (
// 			!latestPriceResult.length ||
// 			latestPriceResult[0].price !== updatedPriceData[0].price
// 		) {
// 			insertedPrice = await db.insert(Price).values(updatedPriceData);
// 			// .returning({
// 			// 	id: Price.id,
// 			// 	productId: Price.productId,
// 			// 	storeId: Price.storeId,
// 			// });
// 			// .onConflictDoNothing();
// 		}

// 		writtenPrices.push(insertedPrice);

// 		if (insertedPrice instanceof Error) {
// 			console.error("Error writing price to db", insertedPrice);
// 			return {
// 				message: insertedPrice.message,
// 				count: 0,
// 			};
// 		}
// 	}

// 	return {
// 		message: "Product and Price written to db",
// 		count: products.length,
// 		writtenProducts: writtenProducts.length,
// 		writtenPrices: writtenPrices.length,
// 	};
// };
