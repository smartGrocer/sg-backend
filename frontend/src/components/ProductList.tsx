import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";

const PRODUCTS_ENDPOINT = "https://smartgrocer.nmpereira.com/api/products/all";
const queryParams = {
	per_page: "10",
	page: "1",
};

type Pagination = {
	count: number;
	pageNumber: number;
	pageSize: number;
	totalPages: number;
	totalResults: number;
};

type Product = {
	chain_brand: string;
	createdAt: string;
	description: string;
	productBrand: string;
	product_image: string;
	product_link: string;
	product_name: string;
	product_num: string;
	updatedAt: string;
};

type IProductsResponse = {
	pagination: Pagination;
	products: Product[];
};

const ProductList = () => {
	const [products, setProducts] = useState<Product[] | null>(null);
	// const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		const params = new URLSearchParams(queryParams);

		const getData = async () => {
			const response = await fetch(`${PRODUCTS_ENDPOINT}?${params}`);
			const data: IProductsResponse = await response.json();
			console.log(data);
			setProducts(data.products);
		};

		getData();
	}, []);

	return (
		<div className="flex flex-row flex-wrap gap-4 w-11/12 mx-auto justify-center">
			{products?.map((product) => {
				return (
					<ProductCard
						key={product.product_num}
						productName={product.product_name}
						imgUrl={product.product_image}
					/>
				);
			})}
		</div>
	);
};
export default ProductList;
