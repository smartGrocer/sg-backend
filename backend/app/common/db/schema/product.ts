import mongoose from "mongoose";

const productLinkSchema = new mongoose.Schema(
	{
		flag_name: {
			type: String,
			required: true,
		},
		product_link: {
			type: String,
			required: true,
		},
	},
	{ _id: false }
);

const productSchema = new mongoose.Schema({
	product_num: {
		type: String,
		required: true,
	},
	parent_company: {
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
	product_links: {
		type: [productLinkSchema],
		default: [],
	},
	product_image: {
		type: String,
	},
	description: {
		type: String,
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

productSchema.index({ product_num: 1, parent_company: 1 }, { unique: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
