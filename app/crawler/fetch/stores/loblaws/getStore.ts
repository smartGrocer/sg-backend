import axios from "axios";
import {
	IStoreLoblawsSrcProps,
	LoblawsChainAlternateName,
	LoblawsChainName,
	LoblawsStore,
} from "../../../../common/types/loblaws/loblaws";
import { IStoreProps } from "../../../../common/types/common/store";
import {
	getCachedData,
	saveToCache,
} from "../../../../common/cache/storeCache";

const getLoblawsStores = async ({
	showAllStores,
	chainName,
}: LoblawsStore): Promise<IStoreProps[] | Error> => {
	if (!chainName && !showAllStores) {
		throw new Error("Chain name is required");
	}

	// if the chain name is not in the enum, throw an error
	if (
		!Object.values(LoblawsChainName).includes(chainName) &&
		!showAllStores
	) {
		throw new Error("Invalid chain name");
	}

	const cacheKey = `stores-${chainName}-${showAllStores ? "all" : chainName}`;

	const cachedData = await getCachedData(cacheKey);

	if (cachedData) {
		return cachedData;
	}

	const listOfStores = showAllStores
		? Object.values(LoblawsChainName)
		: [chainName];

	try {
		const returnData = [] as IStoreProps[];

		// if showAllStores is true, return all stores. Otherwise, return the store for the chain name
		for (let i = 0; i < listOfStores.length; i++) {
			const url = `https://www.${LoblawsChainAlternateName(listOfStores[i])}.ca/api/pickup-locations`;
			const bannerId = listOfStores[i];
			const fetchUrl = `${url}?bannerIds=${bannerId}`;

			const response = (await axios.get(fetchUrl)).data;

			const data = response.map((store: IStoreLoblawsSrcProps) => {
				return {
					id: store.id,
					store_id: store.storeId,
					chain_name: store.storeBannerId,
					store_name: store.name,
					latitude: store.geoPoint.latitude,
					longitude: store.geoPoint.longitude,
					formatted_address: store.address.formattedAddress,
					city: store.address.town,
					line1: store.address.line1,
					line2: store.address.line2,
					postal_code: store.address.postalCode,
					province: store.address.region,
					country: store.address.country,
				};
			});

			// filter duplicates if it has any of the following duplicate properties: store_id, latitude, longitude, line1
			const filteredData = filterDuplicates(data);

			returnData.push(...filteredData);
		}

		await saveToCache({
			key: cacheKey,
			data: returnData,
			cacheInRedis: !cachedData,
		});
		return returnData;
	} catch (error: any) {
		return error as Error;
	}
};

const filterDuplicates = (data: IStoreProps[]): IStoreProps[] => {
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

	//keep only the ones with a duplicate store_id
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

export default getLoblawsStores;
