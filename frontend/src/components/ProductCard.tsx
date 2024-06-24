const ProductCard = () => {
	return (
		<div className="card card-side card-compact bg-base-100 shadow-xl w-80 mx-auto  ">
			<figure>
				<img
					src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
					alt="Movie"
				/>
			</figure>
			<div className="card-body">
				<h2 className="card-title">New movie is released!</h2>
				<p>Click the button to watch on Jetflix app.</p>
			</div>
		</div>
	);
};
export default ProductCard;
