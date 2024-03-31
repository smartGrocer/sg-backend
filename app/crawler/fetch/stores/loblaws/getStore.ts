import axios from "axios";
// eslint-disable-next-line import/no-cycle
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
import filterStoreDuplicates from "../../../../common/helpers/filterStoreDuplicates";

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

	const cachedData = await getCachedData({
		key: cacheKey,
		cacheInRedis: true,
	});

	if (cachedData) {
		return cachedData;
	}

	const listOfStores = showAllStores
		? Object.values(LoblawsChainName)
		: [chainName];

	try {
		const returnData = [] as IStoreProps[];

		// if showAllStores is true, return all stores. Otherwise, return the store for the chain name
		for await (const iStore of listOfStores) {
			const url = `https://www.${LoblawsChainAlternateName(iStore)}.ca/api/pickup-locations`;
			const bannerId = iStore;
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
