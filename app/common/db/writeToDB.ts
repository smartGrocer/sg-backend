import db from "./db";
import { Price, Product, Store } from "./schema";
import { IStoreProps } from "../types/common/store";
import { IProductProps } from "../types/common/product";

interface IWriteStoreToDbReturn {
	message: string;
	count: number;
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

		const priceData = products.map((product) => {
			return {
				price: product.price,
				price_unit: product.price_unit,
				price_was: product.price_was,
				price_was_unit: product.price_was_unit,
				compare_price: product.compare_price,
				compare_price_unit: product.compare_price_unit,
				compare_price_quantity: product.compare_price_quantity,
				storeId: product.store_num,
				productId: product.product_num,
			};
		});

		const productData = products.map((product) => {
			return {
				storeId: product.store_num,
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

		const insertedPrices = await db
			.insert(Price)
			.values(priceData[0])
			.onConflictDoNothing();

		const insertedProducts = await db
			.insert(Product)
			.values(productData[0])
			.onConflictDoNothing();

		if (insertedPrices instanceof Error) {
			return {
				message: insertedPrices.message,
				count: 0,
			};
		}
		if (insertedProducts instanceof Error) {
			return {
				message: insertedProducts.message,
				count: 0,
			};
		}

		return {
			message: "Products written to db",
			count: products.length,
		};
	} catch (e) {
		console.error("Error writing products to db", e);
		return {
			message: "Error writing products to db",
			count: 0,
		};
	}
};
