import axios, { AxiosResponse } from "axios";

import getSecret from "./getSecret";
import {
	getLocalCachedData,
	saveToLocalCache,
} from "../cache/localCache/localCache";
import { PandaBrowserKeys } from "../types/common/product";

interface IUsePandaBrowserArgs {
	url: string;
	key: PandaBrowserKeys;
}

interface IUsePandaBrowserReturn {
	response: AxiosResponse;
	resData: any;
}

const usePandaBrowser = async ({
	url,
	key,
}: IUsePandaBrowserArgs): Promise<IUsePandaBrowserReturn> => {
	let response = {} as AxiosResponse;
	let resData;

	try {
		const isDown = await getLocalCachedData(key);

		if (!isDown) {
			response = await axios.get(url);
			resData = response.data;
		}
		// throw error type
		throw new Error("error-isDown");
	} catch (e: any) {
		// if 403 or if error type is "error-isDown"
		if (e?.response?.status === 403 || e?.message === "error-isDown") {
			await saveToLocalCache(key, true, 1000 * 60 * 60);
			const pandaURL = `${getSecret("PANDA_BROWSER_URL")}/api/article?full-content=true&cache=false&url=${url}`;
			response = await axios.get(pandaURL).catch((e) => {
				throw new Error(
					`Panda Error fetching products for metro, status: ${e}`
				);
			});
			resData = response.data.fullContent;
			if (response.status === 200) {
				console.log(
					`Panda Service: Fetched data from panda for ${url}`
				);
			}
		}
	}

	if (response?.status === 500) {
		throw new Error(
			`Errors fetching products for metro, status: ${response.status}`
		);
	}

	return {
		response,
		resData,
	};
};

export default usePandaBrowser;
