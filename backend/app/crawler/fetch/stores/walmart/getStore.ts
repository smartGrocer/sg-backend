import axios from "axios";
import UserAgent from "user-agents";
import { TValidPostalCode } from "../../../../common/helpers/validatePostalCode";
import { IStoreWalmartSrcProps } from "../../../../common/types/walmart/walmart";
// eslint-disable-next-line import/no-cycle
import {
	AllStoreChainBrands,
	IStoreProps,
} from "../../../../common/types/common/store";
import {
	getCachedData,
	saveToCache,
} from "../../../../common/cache/storeCache";

interface IGetWalmartStores {
	validPostalCode: TValidPostalCode;
}

const getWalmartStores = async ({
	validPostalCode,
}: IGetWalmartStores): Promise<IStoreProps[] | Error> => {
	try {
		const cacheKey = `stores-walmart-${validPostalCode}`;
		const cachedData = await getCachedData({
			key: cacheKey,
			cacheInRedis: true,
		});

		if (cachedData) {
			return cachedData;
		}
		const url = `https://www.walmart.ca/en/stores-near-me/api/searchStores`;
		const postalCodeQuery = `singleLineAddr=${validPostalCode}`;
		const urlWithQuery = `${url}?${postalCodeQuery}`;

		const userAgent = new UserAgent().toString();

		const response = (
			await axios.get(urlWithQuery, {
				headers: {
					"user-agent": userAgent,
				},
			})
		).data.payload.stores as IStoreWalmartSrcProps[];

		const data: IStoreProps[] = response.map(
			(store: IStoreWalmartSrcProps) => {
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
					store_num: store.id,
					parent_company: AllStoreChainBrands.walmart,
					chain_name: "walmart",
					store_name: store.displayName,
					latitude: store.geoPoint.latitude,
					longitude: store.geoPoint.longitude,
					formatted_address,
					city: store.address.city,
					line1: store.address.address1,
					line2: store.address.address6,
					postal_code: store.address.postalCode,
					province: store.address.state,
					country: store.address.country,
				};
			}
		);

		await saveToCache({
			key: cacheKey,
			data,
			cacheInRedis: true,
		});

		return data;
	} catch (error: unknown) {
		return error as Error;
	}
};

export default getWalmartStores;
