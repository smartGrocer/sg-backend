import { eq, and, desc } from "drizzle-orm";
import db from "./db";
// import { Price, Product, Store, StoreProduct } from "./schema";
import { AllStoreChainBrands, IStoreProps } from "../types/common/store";
import {
	IPriceData,
	IProductData,
	IProductProps,
} from "../types/common/product";
import chunkedByStores from "../helpers/chunkedByStores";
import Store from "./schema/store";
import Product from "./schema/product";

interface IWriteStoreToDbReturn {
	message: string;
	count: number;
	writtenProducts?: number;
	writtenPrices?: number;
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

		// const bulkOperations = products.map((product) => ({
		// 	updateOne: {
		// 		filter: { product_num: product.product_num },
		// 		update: {
		// 			$setOnInsert: product, // Set all product fields
		// 			$addToSet: {
		// 				// Add to priceHistory if it doesn't exist
		// 				priceHistory: {
		// 					store_num: product.store_num,
		// 					history: [
		// 						{
		// 							date: new Date(), // Set current date
		// 							amount: product.price, // Set initial price
		// 						},
		// 					],
		// 				},
		// 			},
		// 			$set: {
		// 				// Update updatedAt field
		// 				updatedAt: new Date(),
		// 			},
		// 		},
		// 		upsert: true,
		// 	},
		// }));

		const bulkOperations = products.map((product) => ({
			updateOne: {
				filter: { product_num: product.product_num },
				update: {
					$setOnInsert: product,
					$addToSet: {
						priceHistory: {
							store_num: { $each: [product.store_num] }, // Ensure store_num is an object
							history: {
								$each: [
									{
										date: new Date(),
										amount: 2,
									},
								],
							},
						},
					},
					$set: {
						updatedAt: new Date(),
					},
				},
				upsert: true,
			},
		}));

		const insertedProducts = await Product.bulkWrite(bulkOperations);

		if (insertedProducts instanceof Error) {
			return {
				message: insertedProducts.message,
				count: 0,
			};
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { upsertedIds, ...logdata } = insertedProducts;

		console.log("insertedProducts", logdata);

		return {
			message: "Store and products written to db",
			count: products.length,
			writtenProducts: 0,
			writtenPrices: 0,
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
