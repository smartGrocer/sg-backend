import axios from "axios";
import {
	IStoreLoblawsSrcProps,
	LoblawsChainName,
	LoblawsStore,
} from "../../../../common/types/loblaws/loblaws";
import { IStoreProps } from "../../../../common/types/common/store";

const getLoblawsStores = async ({
	chainName,
}: LoblawsStore): Promise<IStoreProps[] | Error> => {
	if (!chainName) {
		throw new Error("Chain name is required");
	}

	// if the chain name is not in the enum, throw an error
	if (!Object.values(LoblawsChainName).includes(chainName)) {
		throw new Error("Invalid chain name");
	}

	const url = `https://www.loblaws.ca/api/pickup-locations`;
	const bannerId = chainName;
	const fetchUrl = `${url}?bannerIds=${bannerId}`;

	try {
		const response = await axios.get(fetchUrl);
		const data = response.data.map((store: IStoreLoblawsSrcProps) => {
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

		return data;
	} catch (error: any) {
		throw new Error(
			`Error fetching stores for walmart: ${error?.response?.statusText} | ${error}`
		);
	}
};

export default getLoblawsStores;
