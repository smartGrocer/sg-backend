import axios from "axios";
import * as cheerio from "cheerio";
// eslint-disable-next-line import/no-cycle
import {
	AllParentCompanyList,
	IStoreProps,
} from "../../../../common/types/common/store";
import { MetroFlags } from "../../../../common/types/metro/metro";
import {
	getCachedData,
	saveToCache,
} from "../../../../common/cache/storeCache";

interface IGetMetroStores {
	flagName: MetroFlags;
}

const getMetroStores = async ({
	flagName,
}: IGetMetroStores): Promise<IStoreProps[] | Error> => {
	try {
		const cacheKey = `stores-${flagName}`;
		const cachedData = await getCachedData({
			key: cacheKey,
			cacheInRedis: true,
		});

		if (cachedData) {
			return cachedData;
		}
		const endpoint = `/find-a-grocery`;
		const domain = `https://www.${flagName}.ca`;
		const url =
			flagName === MetroFlags.metro
				? `${domain}/en${endpoint}`
				: `${domain}${endpoint}`;

		const response = await axios.get(url);

		const resData = response.data;

		// // clean data by removing \n \r \t
		const cleanData = resData.replace(/\n|\r|\t/g, "");

		const $ = cheerio.load(cleanData);
		const data = [] as IStoreProps[];

		// get the ul with the id of mapResults and loop through the li with id fs--box-shop
		$("#mapResults")
			.find("li.fs--box-shop")
			.each((_i, el) => {
				const storeId = $(el).attr("data-store-id") || ""; // store id
				const storeName = $(el).attr("data-store-name") || ""; // store name
				const storeLatitude = $(el).attr("data-store-lat") || ""; // store latitude
				const storeLongitude = $(el).attr("data-store-lng") || ""; // store longitude

				// get child address--line1
				const storeAddress_line1 =
					$(el).find(".address--line1").text().trim() || "";
				const storeAddress_line2 =
					$(el).find(".address--line2").text().trim() || "";

				// from the address--line2, get the city, postal code, province, and country
				const storeCity = storeAddress_line2.split(",")[0] || "";
				const storePostalProvince =
					storeAddress_line2.split(",")[1].trim().split(" ") || [];
				const storeProvince = storePostalProvince[0] || "";
				const storePostalCode =
					storePostalProvince.slice(1).join(" ") || "";
				const storeCountry = "Canada";

				data.push({
					store_num: storeId,
					parent_company:
						flagName === "metro"
							? AllParentCompanyList.metro
							: AllParentCompanyList.foodbasics,
					flag_name: flagName,
					store_name: storeName,
					latitude: parseFloat(storeLatitude),
					longitude: parseFloat(storeLongitude),
					formatted_address: `${storeAddress_line1}, ${storeAddress_line2}`,
					city: storeCity,
					line1: storeAddress_line1,
					line2: storeAddress_line2,
					postal_code: storePostalCode,
					province: storeProvince,
					country: storeCountry,
				});
			});

		saveToCache({
			key: cacheKey,
			data,
			cacheInRedis: true,
		});

		return data;
	} catch (error: unknown) {
		return error as Error;
	}
};

export default getMetroStores;
