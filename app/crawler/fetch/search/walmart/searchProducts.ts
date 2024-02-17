import UserAgent from "user-agents";
import {
	IProductProps,
	ISearchProducts,
} from "../../../../common/types/common/product";
import {
	query,
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
			"User-Agent": `PostmanRuntime/7.36.1`,
			Host: "www.walmart.ca",
			Connection: "keep-alive",
			Accept: "*/*",
			"Accept-Encoding": "gzip, deflate, br",
		};
		const body = searchProductsWalmartBody({ search_term });

		// graphql search
		const response = await axios({
			method: "post",
			url,
			headers,
			data: query,
		});

		if (response.status === 500) {
			throw new Error(
				`Errors fetching products for walmart, status: ${response.status}`
				// `Errors fetching products for walmart, status: ${response.status}`
			);
		}

		const resData = response.data;

		const data = resData.data.search.searchResult.itemStacks[0];

		return data;
	} catch (error: any) {
		console.log(
			`Error fetching products for walmart`,
			error?.response || error
		);
		return new Error(
			`Error fetching products for walmart: ${error.response.status} | ${error.response.statusText} | ${error.response.data}`
		);
	}
};

export default searchProducts;
