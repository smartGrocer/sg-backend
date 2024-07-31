import { IStoreProps } from "../types/common/store";
import { IProductProps } from "../types/common/product";

import Store from "./schema/store";
import Product from "./schema/product";
import Price from "./schema/price";
import logger from "../logging/logger";

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
					parent_company: store.parent_company,
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

		logger.info({
			message: `Stores written to db: ${stores.length} upserted: ${upsertedCount} modified: ${modifiedCount}`,
			service: "scrapper",
		});
		return {
			message: "Stores written to db",
			count: stores.length,
		};
	} catch (e) {
		logger.error({
			message: "Error writing store to db",
			error: e,
			service: "scrapper",
		});
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

		const bulkOperations = products.map((product) => {
			// Construct the product_link map
			const productLinksUpdate: { [key: string]: string } = {};
			productLinksUpdate[`product_link.${product.flag_name}`] =
				product.product_link;

			return {
				updateOne: {
					filter: {
						product_num: product.product_num,
						parent_company: product.parent_company,
					},
					update: {
						$set: {
							...(product.description !== "" && {
								description: product.description,
							}),
							product_num: product.product_num,
							parent_company: product.parent_company,
							product_brand: product.product_brand,
							product_name: product.product_name,
							// product_link: product.product_link,
							product_image: product.product_image,
							updatedAt: new Date(),
							...productLinksUpdate,
						},
					},
					upsert: true,
				},
			};
		});

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
		logger.error({
			message: "Error writing products to db",
			error,
			service: "scrapper",
		});
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
		logger.error({
			message: "Error writing product prices to db",
			error,
			service: "scrapper",
		});
		return {
			message: "Error writing product prices to db",
			count: 0,
		};
	}
};
