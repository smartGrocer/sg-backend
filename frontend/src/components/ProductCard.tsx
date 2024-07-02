type ProductCardProps = {
	children?: JSX.Element;
	productName: string;
	imgUrl: string;
};

const ProductCard = ({ productName, imgUrl }: ProductCardProps) => {
	return (
		<div className="flex flex-col gap-2 p-2 w-40 items-center bg-slate-100 rounded-lg ">
			<figure className="rounded-md overflow-hidden">
				<img
					src={imgUrl}
					alt={productName}
					className="w-full mx-auto"
				/>
			</figure>
			<h3 className="text-slate-700 font-bold">{productName}</h3>
		</div>
	);
};
export default ProductCard;
