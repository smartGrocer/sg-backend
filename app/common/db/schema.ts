import { relations, sql } from "drizzle-orm";
import {
	integer,
	primaryKey,
	sqliteTable,
	text,
	unique,
} from "drizzle-orm/sqlite-core";

export const Store = sqliteTable(
	"Store",
	{
		id: integer("id", { mode: "number" }).primaryKey({
			autoIncrement: true,
		}),
		store_num: text("store_num").notNull(),
		chain_name: text("chain_name").notNull(),
		chain_brand: text("chain_brand").notNull(),
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
	},

	(t) => ({
		unique: unique().on(t.store_num, t.chain_name),
	})
);

export const Product = sqliteTable(
	"Product",
	{
		id: integer("id", { mode: "number" }).primaryKey({
			autoIncrement: true,
		}),
		storeId: integer("storeId")
			.notNull()
			.references(() => Store.id),
		product_num: text("product_num").notNull(),
		chain_brand: text("chain_brand").notNull(),
		product_brand: text("product_brand"),
		product_name: text("product_name"),
		product_link: text("product_link"),
		product_image: text("product_image"),
		product_size_unit: text("product_size_unit"),
		product_size_quantity: integer("product_size_quantity"),
		unit_soldby_type: text("unit_soldby_type"),
		unit_soldby_unit: text("unit_soldby_unit"),
		createdAt: text("created_at")
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},

	(t) => ({
		unique: unique().on(t.product_num, t.chain_brand),
	})
);

export const Price = sqliteTable(
	"Price",
	{
		id: integer("id", { mode: "number" }).primaryKey({
			autoIncrement: true,
		}),
		productId: integer("productId")
			.notNull()
			.references(() => Product.id),

		storeId: integer("storeId")
			.notNull()
			.references(() => Store.id),
		chain_brand: text("chain_brand").notNull(),
		price: integer("price"),
		price_unit: text("price_unit"),
		price_was: integer("price_was"),
		price_was_unit: text("price_was_unit"),
		compare_price: integer("compare_price"),
		compare_price_unit: text("compare_price_unit"),
		compare_price_quantity: integer("compare_price_quantity"),
		createdAt: text("created_at")
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	}
	// ,
	// unique constraint on productId, storeId
	// (t) => ({
	// 	unique: unique().on(t.productId, t.chain_brand),
	// })
);

export const StoreProduct = sqliteTable(
	"store_to_product",
	{
		storeId: integer("storeId")
			.notNull()
			.references(() => Store.id),
		productId: integer("productId")
			.notNull()
			.references(() => Product.id),
	},
	(t) => ({
		primary_key: primaryKey({ columns: [t.storeId, t.productId] }),
	})
);
export const ProductRelations = relations(Product, ({ many, one }) => ({
	StoreProduct: many(StoreProduct),
	ProductPrice: one(Price, {
		fields: [Product.id],
		references: [Price.productId],
	}),
}));

export const StoreRelations = relations(Store, ({ many }) => ({
	StoreProduct: many(StoreProduct),
	StorePrice: many(Price),
}));

export const PriceRelations = relations(Price, ({ one }) => ({
	ProductPrice: one(Product, {
		fields: [Price.productId],
		references: [Product.id],
	}),
	StorePrice: one(Store, {
		fields: [Price.storeId],
		references: [Store.id],
	}),
}));

export const StoreProductRelations = relations(StoreProduct, ({ one }) => ({
	Store: one(Store, {
		fields: [StoreProduct.storeId],
		references: [Store.id],
	}),
	Product: one(Product, {
		fields: [StoreProduct.productId],
		references: [Product.id],
	}),
}));

/**
drop table Price;
drop table store_to_product;
drop table Product;
drop table Store;
.tables
 */
