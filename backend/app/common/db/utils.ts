import { IProductProps } from "../types/common/product";
/**
 * If there is no existing price history or the last price is not the same as the current price, add a new price entry to the history
 */
const isLastPriceSame = ({
	existingPriceHistory,
	product,
}: {
	existingPriceHistory: {
		product_num: string;
		store_num: string;
		history: { date: Date; amount: number }[];
	} | null;
	product: IProductProps;
}): boolean => {
	return (
		!existingPriceHistory ||
		existingPriceHistory.history.length === 0 ||
		existingPriceHistory.history[existingPriceHistory.history.length - 1]
			.amount !== product.price
	);
};

export default isLastPriceSame;
