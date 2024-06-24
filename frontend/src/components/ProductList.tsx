import ProductCard from "./ProductCard";

const ProductList = () => {
	const placeholder = new Array(10).fill(0);

	return (
		<div className="flex flex-col gap-2">
			{placeholder.map((_, i) => {
				return <ProductCard key={i} />;
			})}
		</div>
	);
};
export default ProductList;
