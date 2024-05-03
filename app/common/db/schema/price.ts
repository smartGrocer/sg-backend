import mongoose from "mongoose";

const priceEntrySchema = new mongoose.Schema(
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
	{ _id: false }
);

const priceHistorySchema = new mongoose.Schema({
	product_num: {
		type: String,
		required: true,
	},
	store_num: {
		type: String,
		required: true,
	},
	history: {
		type: [priceEntrySchema],
		default: [],
	},
});

priceHistorySchema.index({ product_num: 1, store_num: 1 }, { unique: true });

const Price = mongoose.model("Price", priceHistorySchema);

export default Price;
