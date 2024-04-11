import { eq, and } from "drizzle-orm";
import db from "./db";
import { Price, Product, Store, StoreProduct } from "./schema";
import { IStoreProps } from "../types/common/store";
import {
	IPriceData,
	IProductData,
	IProductProps,
} from "../types/common/product";
import chunkedByStores from "../helpers/chunkedByStores";

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

		const chunkByStores = chunkedByStores(products);

		for await (const storeChunk of chunkByStores) {
			// chunkByStores.forEach(async (storeChunk) => {
			const existingStore = await db
				.select()
				.from(Store)
				.where(eq(Store.store_num, storeChunk[0].store_num))
				.limit(1);

			const productData: IProductData[] = products.map((product) => {
				return {
					storeId: existingStore[0]?.id,
					chain_name: existingStore[0]?.chain_name,
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
			await writeProductsToDb({
				productData,
				products,
			});
		}
		// });

		return {
			message: "Store and products written to db",
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

// take insertedProducts and priceData and make an array of arrays of priceData with priceData with productId, storeId but without product_num
const updatePriceData = async (
	insertedProducts: {
		id: number;
		storeId: number;
		product_num: string;
	}[],
	products: IProductProps[]
): Promise<IPriceData[]> => {
	const updatedPriceData = products.map((product) => {
		const productData = insertedProducts.find(
			(insertedProduct) =>
				insertedProduct.product_num === product.product_num
		);

		if (!productData) {
			return null;
		}

		return {
			productId: productData.id,
			storeId: productData.storeId,
			price: product.price,
			price_unit: product.price_unit,
			price_was: product.price_was,
			price_was_unit: product.price_was_unit,
			compare_price: product.compare_price,
			compare_price_unit: product.compare_price_unit,
			compare_price_quantity: product.compare_price_quantity,
		};
	});

	return updatedPriceData.filter(
		(priceData) => priceData !== null
	) as IPriceData[];
};

const writeProductsToDb = async ({
	productData,
	products,
}: {
	productData: IProductData[];
	products: IProductProps[];
}): Promise<IWriteStoreToDbReturn> => {
	// productData.forEach(async (product) => {
	// 	if (!product.storeId) {
	// 		console.error("Error writing products to db, no storeId found");
	// 		return {
	// 			message: "Error writing products to db, no storeId found",
	// 			count: 0,
	// 		};
	// 	}
	// 	const existingProduct = await db
	// 		.select()
	// 		.from(Product)
	// 		.where(
	// 			and(
	// 				eq(Product.storeId, product.storeId),
	// 				eq(Product.product_num, product.product_num)
	// 			)
	// 		)
	// 		.limit(1);
	// 	let insertedProduct;
	// 	if (!existingProduct.length) {
	// 		// insert product
	// 		insertedProduct = await db
	// 			.insert(Product)
	// 			.values(product)
	// 			.returning({
	// 				id: Product.id,
	// 				product_num: Product.product_num,
	// 				storeId: Product.storeId,
	// 			})
	// 			.onConflictDoNothing();
	// 	}
	// 	if (insertedProduct instanceof Error) {
	// 		console.error("Error writing products to db", insertedProduct);
	// 		return {
	// 			message: insertedProduct.message,
	// 			count: 0,
	// 		};
	// 	}
	// 	const returnedProduct = insertedProduct || existingProduct;
	// 	// eslint-disable-next-line no-use-before-define
	// 	const updatedPriceData = await updatePriceData(
	// 		[...returnedProduct],
	// 		products
	// 	);
	// 	const insertedPrices = await db
	// 		.insert(Price)
	// 		.values(updatedPriceData)
	// 		.returning({
	// 			id: Price.id,
	// 			productId: Price.productId,
	// 			storeId: Price.storeId,
	// 		})
	// 		.onConflictDoNothing();
	// 	if (insertedPrices instanceof Error) {
	// 		console.error("Error writing prices to db", insertedPrices);
	// 		return {
	// 			message: insertedPrices.message,
	// 			count: 0,
	// 		};
	// 	}
	// 	await db.insert(StoreProduct).values(
	// 		returnedProduct.map((prod) => ({
	// 			storeId: prod.storeId,
	// 			productId: prod.id,
	// 		}))
	// 	);
	// 	return {
	// 		message: "Product and Price written to db",
	// 		count: products.length,
	// 	};
	// });
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
			.select()
			.from(Product)
			.where(
				and(
					eq(Product.storeId, product.storeId),
					eq(Product.product_num, product.product_num)
				)
			)
			.limit(1);

		let insertedProduct;
		if (!existingProduct.length) {
			// insert product
			insertedProduct = await db
				.insert(Product)
				.values(product)
				.returning({
					id: Product.id,
					product_num: Product.product_num,
					storeId: Product.storeId,
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

		// eslint-disable-next-line no-use-before-define
		const updatedPriceData = await updatePriceData(
			[...returnedProduct],
			products
		);

		const insertedPrices = await db
			.insert(Price)
			.values(updatedPriceData)
			.returning({
				id: Price.id,
				productId: Price.productId,
				storeId: Price.storeId,
			})
			.onConflictDoNothing();

		if (insertedPrices instanceof Error) {
			console.error("Error writing prices to db", insertedPrices);
			return {
				message: insertedPrices.message,
				count: 0,
			};
		}

		writtenPrices.push(insertedPrices);

		await db
			.insert(StoreProduct)
			.values(
				returnedProduct.map((prod) => ({
					storeId: prod.storeId,
					productId: prod.id,
				}))
			)
			.onConflictDoNothing();

		console.log(
			"wrote product and price to db",
			returnedProduct[0].product_num
		);
	}

	console.log("wrote products and prices to db", {
		writtenProducts: writtenProducts.length,
		writtenPrices: writtenPrices.length,
	});

	return {
		message: "Product and Price written to db",
		count: products.length,
	};
};
