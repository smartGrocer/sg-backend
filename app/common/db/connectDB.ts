import mongoose from "mongoose";
import getSecret from "../helpers/getSecret";
import logger from "../logging/logger";

const DB_STRING = getSecret("MONGO_URI");

const connectDB = async (): Promise<void> => {
	try {
		// mongoose setup
		const conn = await mongoose.connect(DB_STRING, {
			dbName: "scrape",
		});

		logger.verbose({
			message: `MongoDB Connected: ${conn.connection.db.databaseName}`,
		});
	} catch (err) {
		logger.error({
			message: "Error connecting to MongoDB",
			error: err?.toString(),
		});
		process.exit(1);
	}
};

export default connectDB;
