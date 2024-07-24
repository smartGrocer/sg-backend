import axios from "axios";
// eslint-disable-next-line import/no-cycle
import {
	IStoreLoblawsSrcProps,
	LoblawsFlagAlternateName,
	LoblawsFlagName,
	LoblawsStore,
} from "../../../../common/types/loblaws/loblaws";
// eslint-disable-next-line import/no-cycle
import {
	AllParentCompanyList,
	IStoreProps,
} from "../../../../common/types/common/store";
import {
	getCachedData,
	saveToCache,
} from "../../../../common/cache/storeCache";

const filterStoreDuplicates = (data: IStoreProps[]): IStoreProps[] => {
	return data.reduce((acc: IStoreProps[], store: IStoreProps) => {
		const existingStore = acc.find(
			(t) =>
				(t.store_num === store.store_num && t.line1 === store.line1) ||
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
};

const getLoblawsStores = async ({
	showAllStores,
	flagName,
}: LoblawsStore): Promise<IStoreProps[] | Error> => {
	if (!flagName && !showAllStores) {
		throw new Error("Flag name is required");
	}

	// if the flag name is not in the enum, throw an error
	if (!Object.values(LoblawsFlagName).includes(flagName) && !showAllStores) {
		throw new Error("Invalid flag name");
	}

	const cacheKey = `stores-${flagName}-${showAllStores ? "all" : flagName}`;

	const cachedData = await getCachedData({
		key: cacheKey,
		cacheInRedis: true,
	});

	if (cachedData) {
		return cachedData;
	}

	const listOfStores = showAllStores
		? Object.values(LoblawsFlagName)
		: [flagName];

	try {
		const returnData = [] as IStoreProps[];

		// if showAllStores is true, return all stores. Otherwise, return the store for the flag name
		for await (const iStore of listOfStores) {
			const url = `https://www.${LoblawsFlagAlternateName(iStore)}.ca/api/pickup-locations`;
			const bannerId = iStore;
			const fetchUrl = `${url}?bannerIds=${bannerId}`;

			const response = (await axios.get(fetchUrl))
				.data as IStoreLoblawsSrcProps[];

			const data: IStoreProps[] = response.map(
				(store: IStoreLoblawsSrcProps) => {
					return {
						store_num: store.storeId || "",
						flag_name: store.storeBannerId || "",
						parent_company: AllParentCompanyList.loblaws,
						store_name: store.name || "",
						latitude: store.geoPoint.latitude || 0,
						longitude: store.geoPoint.longitude || 0,
						formatted_address: store.address.formattedAddress || "",
						city: store.address.town || "",
						line1: store.address.line1 || "",
						line2: store.address.line2 || "",
						postal_code: store.address.postalCode || "",
						province: store.address.region || "",
						country: store.address.country || "",
					};
				}
			);

			// filter duplicates if it has any of the following duplicate properties: store_num, latitude, longitude, line1
			const filteredData = filterStoreDuplicates(data);

			returnData.push(...filteredData);
		}

		await saveToCache({
			key: cacheKey,
			data: returnData,
			cacheInRedis: true,
		});
		return returnData;
	} catch (error: unknown) {
		return error as Error;
	}
};

export default getLoblawsStores;
