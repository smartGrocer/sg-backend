import Category from "./Category";

const CategoryList = () => {
	const placeholder = new Array(10).fill(0);

	return (
		<div className="flex  overflow-x-auto gap-2 ">
			{placeholder.map((_, i) => {
				return <Category key={i} />;
			})}
		</div>
	);
};
export default CategoryList;
