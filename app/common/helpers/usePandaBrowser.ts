import axios, { AxiosResponse } from "axios";

import getSecret from "./getSecret";
import { PandaBrowserKeys } from "../types/common/product";
import { getCachedData, saveToCache } from "../cache/storeCache";
import logger from "../logging/logger";

interface IUsePandaBrowserArgs {
	url: string;
	key: PandaBrowserKeys;
}

interface IUsePandaBrowserReturn {
	response: AxiosResponse;
	resData: string;
}

const usePandaBrowser = async ({
	url,
	key,
}: IUsePandaBrowserArgs): Promise<IUsePandaBrowserReturn> => {
	let response = {} as AxiosResponse;
	let resData;

	try {
		// const isDown = await getLocalCachedData(key);
		const isDown = await getCachedData({
			key,
			cacheInRedis: false,
		});

		if (!isDown) {
			response = await axios.get(url);
			resData = response.data;
		}
		// throw error type
		throw new Error("error-isDown");
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		// if 403 or if error type is "error-isDown"
		if (e?.response?.status === 403 || e?.message === "error-isDown") {
			// await saveToLocalCache(key, true, 1000 * 60 * 60);

			await saveToCache({
				key,
				data: true,
				cacheInRedis: false,
			});

			const params = `full-content=true&cache=false&stealth=true&device=Desktop Chrome HiDPI&resource=document,fetch,xhr`;
			const pandaURL = `${getSecret("PANDA_BROWSER_URL")}/api/page?&url=${url}&${params}&service_token=pandapaw`;

			response = await axios.get(pandaURL).catch((err) => {
				throw new Error(
					`Panda Service: Error fetching products for metro, status: ${err}`
				);
			});
			resData = response.data.fullContent;

			if (response.status === 200) {
				logger.verbose({
					message: `Panda Service: Fetched data from panda for ${url}`,
				});
			}
		}
	}

	if (response?.status === 500) {
		throw new Error(
			`Panda Service: Errors fetching products for metro, status: ${response.status}`
		);
	}

	return {
		response,
		resData,
	};
};

export default usePandaBrowser;
