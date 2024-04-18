import axios, { AxiosResponse } from "axios";
import {
	LoblawsChainAlternateName,
	LoblawsChainName,
} from "../../../../common/types/loblaws/loblaws";

const getProductsFromPage = async ({
	store_num,
	chainName,
	page,
}: {
	store_num: number;
	chainName: LoblawsChainName;
	page: number;
}): Promise<AxiosResponse | Error> => {
	try {
		const url = "https://api.pcexpress.ca/pcx-bff/api/v2/listingPage/27985";

		const headers = {
			"Content-Type": "application/json",
			"Accept-Language": "en",
			Origin: `https://www.${LoblawsChainAlternateName(chainName as LoblawsChainName)}.ca`,
			Referer: `https://www.${LoblawsChainAlternateName(chainName as LoblawsChainName)}.ca/`,
			"x-apikey": "C1xujSegT5j3ap3yexJjqhOfELwGKYvz",
			"x-application-type": "Web",
			"x-loblaw-tenant-id": "ONLINE_GROCERIES",
			// Origin_Session_Header: "B",
		};

		const cartId = crypto.randomUUID();

		const body = {
			cart: { cartId },
			fulfillmentInfo: {
				storeId: store_num,
				pickupType: "STORE",
				offerType: "OG",
			},
			listingInfo: {
				filters: {},
				sort: {},
				pagination: { from: page },
				includeFiltersInResponse: true,
			},
			banner: `${chainName}`,
		};

		const response = await axios.post(url, body, { headers });

		return response;
	} catch (e) {
		console.error(e);
		return e as Error;
	}
};

export default getProductsFromPage;
