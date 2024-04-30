import mongoose from "mongoose";

const priceHistorySchema = new mongoose.Schema({
	store_num: {
		type: String,
		required: true,
	},
	history: [
		{
			date: {
				type: Date,
				required: true,
			},
			amount: {
				type: Number,
				required: true,
			},
		},
	],
});

const productSchema = new mongoose.Schema({
	product_num: {
		type: String,
		required: true,
	},
	chain_brand: {
		type: String,
		required: true,
	},
	product_brand: {
		type: String,
	},
	product_name: {
		type: String,
	},
	product_link: {
		type: String,
	},
	product_image: {
		type: String,
	},
	priceHistory: {
		type: Map,
		of: [priceHistorySchema],
		default: {},
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

const Product = mongoose.model("Product", productSchema);

export default Product;
