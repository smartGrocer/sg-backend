import getFoodBasicStores from "./getStore";

const fetchFoodBasicStores = async (req: any, res: any) => {
	const stores = await getFoodBasicStores();

	if (stores instanceof Error) {
		return {
			message: stores.message,
			data: null,
			code: 500,
		};
	}

	return {
		message: `Stores fetched successfully for foodbasics`,
		data: stores,
		code: 200,
	};
};

export default fetchFoodBasicStores;
