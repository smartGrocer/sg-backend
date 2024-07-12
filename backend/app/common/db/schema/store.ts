import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
	store_num: {
		type: String,
		required: true,
	},
	parent_company: {
		type: String,
		required: true,
	},
	chain_name: {
		type: String,
		required: true,
	},
	store_name: {
		type: String,
		required: true,
	},
	latitude: {
		type: Number,
		required: true,
	},
	longitude: {
		type: Number,
		required: true,
	},
	formatted_address: {
		type: String,
	},
	city: {
		type: String,
	},
	line1: {
		type: String,
	},
	line2: {
		type: String,
	},
	postal_code: {
		type: String,
	},
	province: {
		type: String,
	},
	country: {
		type: String,
	},
	scrape: {
		type: Boolean,
		default: false,
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

storeSchema.index({ store_num: 1, parent_company: 1 }, { unique: true });

const Store = mongoose.model("Store", storeSchema);

export default Store;
