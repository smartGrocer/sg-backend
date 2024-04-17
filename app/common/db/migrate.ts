import "dotenv/config";

import { migrate } from "drizzle-orm/libsql/migrator";
import db from "./db";

(async (): Promise<void> => {
	try {
		await migrate(db, {
			migrationsFolder: "./app/common/db/migrations",
		});
		console.log("Migrations complete");
	} catch (e) {
		console.error("Error running migrations", e);
		process.exit(1);
	}
})();
