import mongoose from "mongoose";
import getSecret from "../helpers/getSecret";

const DB_STRING = getSecret("MONGO_URI");

const connectDB = async (): Promise<void> => {
	try {
		// mongoose setup
		const conn = await mongoose.connect(DB_STRING, {
			dbName: "scrape",
		});

		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

export default connectDB;
