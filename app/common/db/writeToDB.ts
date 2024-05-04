import { IStoreProps } from "../types/common/store";
import { IProductProps } from "../types/common/product";

import Store from "./schema/store";
import Product from "./schema/product";
import Price from "./schema/price";

interface IWriteStoreToDbReturn {
	message: string;
	count: number;
	upsertedCount?: number;
	modifiedCount?: number;
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
		const { upsertedCount, modifiedCount } = insertedStores;
		console.log(
			`Stores written to db: ${stores.length} upserted: ${upsertedCount} modified: ${modifiedCount}`
		);
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

		const bulkOperations = products.map((product) => ({
			updateOne: {
				filter: {
					product_num: product.product_num,
					chain_brand: product.chain_brand,
				},
				update: {
					$set: product,
					updatedAt: new Date(),
				},
				upsert: true,
			},
		}));

		const result = await Product.bulkWrite(bulkOperations);

		if (result instanceof Error) {
			return {
				message: result.message,
				count: 0,
			};
		}

		// eslint-disable-next-line no-use-before-define
		await addPricesToDb(products);

		const { upsertedCount, modifiedCount } = result;

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

const addPricesToDb = async (
	products: IProductProps[]
): Promise<IWriteStoreToDbReturn> => {
	try {
		if (!products.length) {
			return {
				message: "No product prices to write to db",
				count: 0,
			};
		}

		const bulkOperations = [];

		for await (const product of products) {
			// Find the existing price history for the product in the store
			const existingPriceHistory = await Price.findOne({
				product_num: product.product_num,
				store_num: product.store_num,
			});

			// If there is no existing price history or the last price is not the same as the current price, add a new price entry to the history
			if (
				!existingPriceHistory ||
				existingPriceHistory.history.length === 0 ||
				existingPriceHistory.history[
					existingPriceHistory.history.length - 1
				].amount !== product.price
			) {
				bulkOperations.push({
					updateOne: {
						filter: {
							product_num: product.product_num,
							store_num: product.store_num,
						},
						update: {
							$push: {
								history: {
									date: new Date(),
									amount: product.price,
								},
							},
						},
						upsert: true,
					},
				});
			}
		}

		const result = await Price.bulkWrite(bulkOperations);

		if (result instanceof Error) {
			return {
				message: result.message,
				count: 0,
			};
		}

		const { upsertedCount, modifiedCount } = result;

		return {
			message: "Product prices written to db",
			count: products.length,
			upsertedCount: upsertedCount || 0,
			modifiedCount: modifiedCount || 0,
		};
	} catch (error) {
		console.error("Error writing product prices to db", error);
		return {
			message: "Error writing product prices to db",
			count: 0,
		};
	}
};
