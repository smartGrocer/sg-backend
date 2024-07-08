import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";
import { VITE_SERVER_URL } from "../common/common";
import { IProductsResponse, Product } from "../common/types/product";

const PRODUCTS_ENDPOINT = `${VITE_SERVER_URL}/api/products/all`;

const queryParams = {
  per_page: "10",
  page: "1",
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(queryParams);

    const getData = async () => {
      const ENDPOINT=`${PRODUCTS_ENDPOINT}?${params}`
      console.log({PRODUCTS_ENDPOINT,ENDPOINT})
      const response = await fetch(ENDPOINT);

      const data: IProductsResponse = await response.json();
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
