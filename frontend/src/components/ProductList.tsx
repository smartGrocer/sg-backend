import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";
import {
  IProductData,
  IProductPropsWithPagination,
} from "../../../backend/app/common/types/common/product";

const PRODUCTS_ENDPOINT = "https://smartgrocer.nmpereira.com/api/products/all";
const queryParams = {
	per_page: "10",
	page: "1",
};

const queryParams = {
  per_page: "10",
  page: "1",
};

const ProductList = () => {
  const [products, setProducts] = useState<IProductData[] | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(queryParams);

    const getData = async () => {
      const response = await fetch(`${PRODUCTS_ENDPOINT}?${params}`);
      const data: IProductPropsWithPagination = await response.json();
      console.log(data);
      setProducts(data.results);
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
