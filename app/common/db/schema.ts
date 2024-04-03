import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Store = sqliteTable("Store", {
	id: text("id").primaryKey().unique(),
	store_id: text("store_id").notNull(),
	chain_name: text("chain_name").notNull(),
	store_name: text("store_name").notNull(),
	latitude: integer("latitude").notNull().default(0),
	longitude: integer("longitude").notNull().default(0),
	formatted_address: text("formatted_address"),
	city: text("city"),
	line1: text("line1"),
	line2: text("line2"),
	postal_code: text("postal_code"),
	province: text("province"),
	country: text("country"),
	createdAt: text("created_at")
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const Product = sqliteTable("Product", {
	id: text("id").primaryKey().unique(),
	product_id: text("product_id").notNull(),
	store_id: text("store_id").notNull(),
	chainName: text("chainName").notNull(),
	product_brand: text("product_brand").notNull(),
	product_name: text("product_name").notNull(),
	product_link: text("product_link").notNull(),
	product_image: text("product_image").notNull(),
	product_size_unit: text("product_size_unit").notNull(),
	product_size_quantity: integer("product_size_quantity").notNull(),
	unit_soldby_type: text("unit_soldby_type").notNull(),
	unit_soldby_unit: text("unit_soldby_unit").notNull(),
	createdAt: text("created_at")
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const Price = sqliteTable("Price", {
	productId: text("productId")
		.notNull()
		.references(() => Product.id),

	storeId: text("storeId")
		.notNull()
		.references(() => Store.id),
	price: integer("price").notNull(),
	price_unit: text("price_unit").notNull(),
	price_was: integer("price_was"),
	price_was_unit: text("price_was_unit"),
	compare_price: integer("compare_price"),
	compare_price_unit: text("compare_price_unit"),
	compare_price_quantity: integer("compare_price_quantity"),
	createdAt: text("created_at")
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});
