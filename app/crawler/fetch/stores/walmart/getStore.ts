import axios from "axios";
import UserAgent from "user-agents";
import { TValidPostalCode } from "../../../../common/helpers/validatePostalCode";
import { IStoreWalmartSrcProps } from "../../../../common/types/walmart/walmart";
import { IStoreProps } from "../../../../common/types/common/store";
import {
	getCachedStoreData,
	saveToCacheStore,
} from "../../../../common/cache/storeCache";

interface IGetWalmartStores {
	validPostalCode: TValidPostalCode;
}

const getWalmartStores = async ({
	validPostalCode,
}: IGetWalmartStores): Promise<IStoreProps[] | Error> => {
	try {
		const url = `https://www.walmart.ca/en/stores-near-me/api/searchStores`;
		const postalCodeQuery = `singleLineAddr=${validPostalCode}`;
		const urlWithQuery = `${url}?${postalCodeQuery}`;

		const userAgent = new UserAgent().toString();

		const cachedData = await getCachedStoreData(urlWithQuery);

		const response =
			(await cachedData) ||
			(
				await axios.get(urlWithQuery, {
					headers: {
						"user-agent": userAgent,
					},
				})
			).data.payload.stores;

		saveToCacheStore({
			key: urlWithQuery,
			data: response,
			cacheInRedis: !cachedData,
		});

		const data = response.map((store: IStoreWalmartSrcProps) => {
			const formatted_address = [
				store.address.address1,
				store.address.address6,
				store.address.city,
				store.address.state,
				store.address.postalCode,
				store.address.country,
			]
				.join(", ")
				.replace(/,\s+/g, ", ");

			return {
				id: store.id,
				store_id: store.id,
				chain_name: "walmart",
				store_name: store.displayName,
				latitude: store.geoPoint.latitude,
				longitude: store.geoPoint.longitude,
				formatted_address: formatted_address,
				city: store.address.city,
				line1: store.address.address1,
				line2: store.address.address6,
				postal_code: store.address.postalCode,
				province: store.address.state,
				country: store.address.country,
			};
		});

		return data;
	} catch (error: unknown) {
		return error as Error;
	}
};

export default getWalmartStores;
