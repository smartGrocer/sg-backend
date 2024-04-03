import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// export const users = sqliteTable("users", {
// 	id: integer("id").primaryKey(),
// 	name: text("name").notNull(),
// 	email: text("email").unique().notNull(),
// });

// export const posts = sqliteTable("posts", {
// 	id: integer("id").primaryKey(),
// 	title: text("title").notNull(),
// 	content: text("content").notNull(),
// 	userId: integer("user_id")
// 		.notNull()
// 		.references(() => users.id, { onDelete: "cascade" }),
// 	createdAt: text("created_at")
// 		.default(sql`CURRENT_TIMESTAMP`)
// 		.notNull(),
// });

// export type InsertUser = typeof users.$inferInsert;
// export type SelectUser = typeof users.$inferSelect;

// export type InsertPost = typeof posts.$inferInsert;
// export type SelectPost = typeof posts.$inferSelect;

export const stores = sqliteTable("stores", {
	id: text("id").primaryKey().unique(),
	store_id: text("store_id").notNull(),
	chain_name: text("chain_name").notNull(),
	store_name: text("store_name").notNull(),
	latitude: integer("latitude").notNull(),
	longitude: integer("longitude").notNull(),
	formatted_address: text("formatted_address").notNull(),
	city: text("city").notNull(),
	line1: text("line1").notNull(),
	line2: text("line2").notNull(),
	postal_code: text("postal_code").notNull(),
	province: text("province").notNull(),
	country: text("country").notNull(),
	createdAt: text("created_at")
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const products = sqliteTable("products", {
	product_id: text("product_id").primaryKey(),
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

export const prices = sqliteTable("prices", {
	productId: text("product_id")
		.notNull()
		.references(() => products.product_id),

	storeId: text("store_id")
		.notNull()
		.references(() => stores.store_id),
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
