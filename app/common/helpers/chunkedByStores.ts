import { IProductProps } from "../types/common/product";

// chunk based on store_num
const chunkedByStores = (products: IProductProps[]): IProductProps[][] => {
	const chunkedProducts: IProductProps[][] = [];
	const storeNums = Array.from(
		new Set(products.map((product) => product.store_num))
	);
	storeNums.forEach((store_num) => {
		const chunked = products.filter(
			(product) => product.store_num === store_num
		);
		chunkedProducts.push(chunked);
	});
	return chunkedProducts;
};

export default chunkedByStores;
