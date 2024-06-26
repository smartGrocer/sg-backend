import ProductCard from "./ProductCard";

const ProductList = () => {
	const placeholder = new Array(10).fill(0);

	return (
		<div className="flex flex-row flex-wrap gap-4 w-11/12 mx-auto justify-center">
			{placeholder.map((_, i) => {
				return <ProductCard key={i} />;
			})}
		</div>
	);
};
export default ProductList;
