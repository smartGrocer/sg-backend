CREATE TABLE `prices` (
	`product_id` text NOT NULL,
	`store_id` text NOT NULL,
	`price` integer NOT NULL,
	`price_unit` text NOT NULL,
	`price_was` integer,
	`price_was_unit` text,
	`compare_price` integer,
	`compare_price_unit` text,
	`compare_price_quantity` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`store_id`) REFERENCES `stores`(`store_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`product_id` text PRIMARY KEY NOT NULL,
	`store_id` text NOT NULL,
	`chainName` text NOT NULL,
	`product_brand` text NOT NULL,
	`product_name` text NOT NULL,
	`product_link` text NOT NULL,
	`product_image` text NOT NULL,
	`product_size_unit` text NOT NULL,
	`product_size_quantity` integer NOT NULL,
	`unit_soldby_type` text NOT NULL,
	`unit_soldby_unit` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stores` (
	`id` text PRIMARY KEY NOT NULL,
	`store_id` text NOT NULL,
	`chain_name` text NOT NULL,
	`store_name` text NOT NULL,
	`latitude` integer NOT NULL,
	`longitude` integer NOT NULL,
	`formatted_address` text NOT NULL,
	`city` text NOT NULL,
	`line1` text NOT NULL,
	`line2` text NOT NULL,
	`postal_code` text NOT NULL,
	`province` text NOT NULL,
	`country` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stores_id_unique` ON `stores` (`id`);