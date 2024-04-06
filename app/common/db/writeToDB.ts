import { eq } from "drizzle-orm";
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
		// find store by store_num
		const existingStore = await db
			.select()
			.from(Store)
			.where(eq(Store.store_num, products[0].store_num))
			.limit(1);

		const productData = products.map((product) => {
			return {
				storeId: existingStore[0].id,
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
		})[0];

		const insertedProducts = await db
			.insert(Product)
			.values(productData)
			.returning({ id: Product.id })
			.onConflictDoNothing();

		console.log({
			insertedProducts,
			insertedProducts2: insertedProducts[0],
		});
		const priceData = products.map((product) => {
			return {
				storeId: existingStore[0].id,
				productId: insertedProducts[0].id,
				price: product.price,
				price_unit: product.price_unit,
				price_was: product.price_was,
				price_was_unit: product.price_was_unit,
				compare_price: product.compare_price,
				compare_price_unit: product.compare_price_unit,
				compare_price_quantity: product.compare_price_quantity,
			};
		})[0];

		// console.log({ priceData, productData, products: products[0] });

		const insertedPrices = await db
			.insert(Price)
			.values(priceData)
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
