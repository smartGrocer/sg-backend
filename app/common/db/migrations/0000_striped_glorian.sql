CREATE TABLE `Price` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`productId` integer NOT NULL,
	`storeId` integer NOT NULL,
	`chain_brand` text NOT NULL,
	`price` integer,
	`price_unit` text,
	`price_was` integer,
	`price_was_unit` text,
	`compare_price` integer,
	`compare_price_unit` text,
	`compare_price_quantity` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Product` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_num` text NOT NULL,
	`chain_brand` text NOT NULL,
	`product_brand` text,
	`product_name` text,
	`product_link` text,
	`product_image` text,
	`product_size_unit` text,
	`product_size_quantity` integer,
	`unit_soldby_type` text,
	`unit_soldby_unit` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Store` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`store_num` text NOT NULL,
	`chain_name` text NOT NULL,
	`chain_brand` text NOT NULL,
	`store_name` text NOT NULL,
	`latitude` integer DEFAULT 0 NOT NULL,
	`longitude` integer DEFAULT 0 NOT NULL,
	`formatted_address` text,
	`city` text,
	`line1` text,
	`line2` text,
	`postal_code` text,
	`province` text,
	`country` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `store_to_product` (
	`storeId` integer NOT NULL,
	`productId` integer NOT NULL,
	PRIMARY KEY(`productId`, `storeId`),
	FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Product_product_num_chain_brand_unique` ON `Product` (`product_num`,`chain_brand`);--> statement-breakpoint
CREATE UNIQUE INDEX `Store_store_num_chain_name_unique` ON `Store` (`store_num`,`chain_name`);