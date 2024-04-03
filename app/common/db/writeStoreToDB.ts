import { eq, and } from "drizzle-orm";
import db from "./db";
import { stores } from "./schema";
import { IStoreProps } from "../types/common/store";

interface IWriteStoreToDbReturn {
	message: string;
	count?: number;
}

const writeStoreToDb = async ({
	store,
}: IStoreProps[]): Promise<IWriteStoreToDbReturn> => {
	try {
		const existingStore = await db
			.select()
			.from(stores)
			.where(
				and(
					eq(stores.store_id, store.store_id),
					eq(stores.chain_name, store.chain_name)
				)
			);
	} catch (e) {
		console.error("Error writing store to db", e);
		return {
			message: "Error writing store to db",
		};
	}
};

export default writeStoreToDb;
