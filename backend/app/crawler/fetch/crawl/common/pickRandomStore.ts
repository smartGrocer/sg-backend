import Store from "../../../../common/db/schema/store";
import logger from "../../../../common/logging/logger";
import { IAllStoreChains } from "../../../../common/types/common/store";

const pickStore = async (
	flagName: IAllStoreChains
): Promise<string | Error> => {
	// pick random store from db based on flagName
	try {
		const randomStore = await Store.aggregate([
			{ $match: { flag_name: flagName, scrape: true } },
			{ $sample: { size: 1 } },
		]);

		if (!randomStore) {
			return new Error("Error picking store");
		}
		const store = randomStore[0]?.store_num;

		if (!store) {
			return new Error("No store found");
		}

		return store;
	} catch (e) {
		logger.error({
			message: `Error picking store ${flagName}`,
			error: e,
			service: "crawler",
		});
		return e as Error;
	}
};

export default pickStore;
