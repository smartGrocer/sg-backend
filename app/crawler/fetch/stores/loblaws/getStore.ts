import axios from "axios";
import {
	IStoreLoblawsSrcProps,
	LoblawsChainAlternateName,
	LoblawsChainName,
	LoblawsStore,
} from "../../../../common/types/loblaws/loblaws";
import { IStoreProps } from "../../../../common/types/common/store";
import {
	getCachedStoreData,
	saveToStoreCache,
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
			const cachedData = await getCachedStoreData(fetchUrl);

			const response =
				(await cachedData) || (await axios.get(fetchUrl)).data;

			saveToStoreCache({
				key: fetchUrl,
				data: response,
				cacheInRedis: !cachedData,
			});

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

		return returnData;
	} catch (error: any) {
		console.log("Error fetching stores for loblaws", error);
		throw new Error(
			`Error fetching stores for loblaws: ${error?.response?.statusText} | ${error}`
		);
	}
};

const filterDuplicates = (data: IStoreProps[]): IStoreProps[] => {
	return data.filter(
		(store: IStoreProps, index: number, self: IStoreProps[]) =>
			index ===
			self.findIndex(
				(t) =>
					t.store_id === store.store_id &&
					t.line1 === store.line1 &&
					// when checking the latitude and longitude, round it to 2 decimal places
					Math.round(t.latitude * 100) / 100 ===
						Math.round(store.latitude * 100) / 100 &&
					Math.round(t.longitude * 100) / 100 ===
						Math.round(store.longitude * 100) / 100
			)
	);
};

export default getLoblawsStores;
