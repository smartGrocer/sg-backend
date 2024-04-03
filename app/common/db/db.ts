// const connectToDb = async (): Promise<void> => {
// 	// connect to db
// 	console.log("Connected to db");
// 	return Promise.resolve();
// };

// export default connectToDb;

import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({
	url: process.env.TURSO_CONNECTION_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN!,
});

const db = drizzle(client);

export default db;
