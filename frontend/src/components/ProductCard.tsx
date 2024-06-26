const ProductCard = () => {
	return (
		<div className="flex flex-col gap-2 p-2 w-40 items-center bg-slate-100 rounded-lg ">
			<figure>
				<img
					src="https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					alt="Movie"
					className="w-full mx-auto"
				/>
			</figure>
			<h3 className="text-slate-800 font-bold">Banana</h3>
		</div>
	);
};
export default ProductCard;
