import db from "./db";
import { Store } from "./schema";
import { IStoreProps } from "../types/common/store";

interface IWriteStoreToDbReturn {
	message: string;
	count: number;
}

export const writeStoreToDb = async (
	stores: IStoreProps[]
): Promise<IWriteStoreToDbReturn> => {
	try {
		if (!stores.length) {
			return {
				message: "No stores to write to db",
				count: 0,
			};
		}
		const insertedStores = await db
			.insert(Store)
			.values(stores)
			.onConflictDoNothing();

		if (insertedStores instanceof Error) {
			return {
				message: insertedStores.message,
				count: 0,
			};
		}

		return {
			message: "Stores written to db",
			count: stores.length,
		};
	} catch (e) {
		console.error("Error writing store to db", e);
		return {
			message: "Error writing store to db",
			count: 0,
		};
	}
};
