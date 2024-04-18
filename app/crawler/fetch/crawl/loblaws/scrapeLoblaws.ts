import { IProductProps } from "../../../../common/types/common/product";
import { LoblawsChainName } from "../../../../common/types/loblaws/loblaws";
import getProductsFromPage from "./getProductsFromPage";

import cleanLoblawsData from "./cleanLoblawsData";

interface IScrapeLoblawsArgs {
	store_num: number;
	chainName: LoblawsChainName;
}

const scrapeLoblaws = async ({
	store_num,
	chainName,
}: IScrapeLoblawsArgs): Promise<IProductProps[] | Error> => {
	try {
		const AllProducts: IProductProps[] = [];

		const initialResponse = await getProductsFromPage({
			page: 1,
			store_num,
			chainName,
		});

		if (initialResponse instanceof Error) {
			return initialResponse;
		}

		const initialData = cleanLoblawsData(initialResponse?.data);
		AllProducts.push(...(initialData?.productTiles || []));

		const totalResults = initialData?.pagination?.totalResults;
		const pageSize = initialData?.pagination?.pageSize;

		const totalPages = Math.ceil(totalResults / pageSize);

		for await (const page of Array.from({ length: totalPages }).map(
			(_, i) => i + 1
		)) {
			const response = await getProductsFromPage({
				page,
				store_num,
				chainName,
			});

			if (response instanceof Error) {
				return response;
			}

			const data = cleanLoblawsData(response.data);

			AllProducts.push(...(data?.productTiles || []));
		}

		return AllProducts;
	} catch (e) {
		console.error(e);
		return e as Error;
	}
};
