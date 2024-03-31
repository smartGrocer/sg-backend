import { IStoreProps } from "../types/common/store";

const filterStoreDuplicates = (data: IStoreProps[]): IStoreProps[] => {
	return data.reduce((acc: IStoreProps[], store: IStoreProps) => {
		const existingStore = acc.find(
			(t) =>
				(t.store_id === store.store_id && t.line1 === store.line1) ||
				// when checking the formatted address, remove any spaces and compare
				(t.formatted_address.replace(/\s/g, "") ===
					store.formatted_address.replace(/\s/g, "") &&
					t.line1 === store.line1) ||
				// when checking the latitude and longitude, round it to 2 decimal places
				(Math.round(t.latitude * 100) / 100 ===
					Math.round(store.latitude * 100) / 100 &&
					Math.round(t.longitude * 100) / 100 ===
						Math.round(store.longitude * 100) / 100) ||
				// If store_name includes the text "testing" or delivery or closed
				store.store_name
					.toLowerCase()
					.includes("Colleague Testing".toLowerCase()) ||
				store.store_name
					.toLowerCase()
					.includes("Delivery".toLowerCase()) ||
				store.store_name.toLowerCase().includes("Closed".toLowerCase())
		);

		if (!existingStore) {
			acc.push(store);
		}

		return acc;
	}, []);

	// keep only the ones with a duplicate store_id
	// const storeIds = data.map((store) => store.store_id);
	// const uniqueStoreIds = [...new Set(storeIds)];
	// const duplicateStoreIds = storeIds.filter(
	// 	(storeId) => storeIds.indexOf(storeId) !== storeIds.lastIndexOf(storeId)
	// );

	// const filteredData = data.filter((store) => {
	// 	return duplicateStoreIds.includes(store.store_id);
	// });

	// return filteredData;
};

export default filterStoreDuplicates;
