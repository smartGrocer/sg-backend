import UserAgent from "user-agents";
import {
	IProductProps,
	ISearchProducts,
} from "../../../../common/types/common/product";
import {
	searchProductWalmartHeaders,
	searchProductsWalmartBody,
} from "./walmartHeaders";
import axios from "axios";

const searchProducts = async ({
	search_term,
	chainName,
	store_id,
}: ISearchProducts) => {
	const domain = `https://www.walmart.ca`;
	const endpoint = `/orchestra/graphql/search`;
	const url = `${domain}${endpoint}`;

	try {
		const userAgent = new UserAgent().toString();
		const headers = {
			...searchProductWalmartHeaders,
			"user-agent": userAgent,
		};
		const body = searchProductsWalmartBody({ search_term });

		const response = await axios.post(url, body, {
			headers,
		});

		if (response.status === 500) {
			throw new Error(
				`Errors fetching products for walmart, status: ${response.status}`
			);
		}

		const resData = response.data;

		const data = resData.data.search.searchResult.itemStacks.itemsV2;

		return data;
	} catch (error) {
		console.log(`Error fetching products for walmart`, error);
		return new Error(`Error fetching products for walmart: ${error}`);
	}
};

export default searchProducts;
