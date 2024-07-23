import axios, { AxiosResponse } from "axios";
import {
	LoblawsFlagAlternateName,
	LoblawsFlagName,
} from "../../../../common/types/loblaws/loblaws";
import logger from "../../../../common/logging/logger";

const getProductsFromPage = async ({
	store_num,
	chainName,
	page,
}: {
	store_num: string;
	chainName: LoblawsFlagName;
	page: number;
}): Promise<AxiosResponse | Error> => {
	try {
		const url = "https://api.pcexpress.ca/pcx-bff/api/v2/listingPage/27985";

		const headers = {
			"Content-Type": "application/json",
			"Accept-Language": "en",
			Origin: `https://www.${LoblawsFlagAlternateName(chainName as LoblawsFlagName)}.ca`,
			Referer: `https://www.${LoblawsFlagAlternateName(chainName as LoblawsFlagName)}.ca/`,
			"x-apikey": "C1xujSegT5j3ap3yexJjqhOfELwGKYvz",
			"x-application-type": "Web",
			"x-loblaw-tenant-id": "ONLINE_GROCERIES",
			Origin_Session_Header: "B",
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
			banner: `loblaw`,
		};

		const response = await axios.post(url, body, { headers });

		return response;
	} catch (e) {
		logger.error({
			message: `Error fetching products for ${chainName} | page: ${page}`,
			error: e,
			service: "crawler",
		});
		return e as Error;
	}
};

export default getProductsFromPage;
