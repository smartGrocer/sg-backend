import {
	// IFormattedPriceHistoryArray,
	IPriceHistoryArray,
} from "../types/common/product";

/**
 * Converts the price history array to an array of objects with date as key and amount as value
 * @param priceHistory - The price history array
 * @returns The morphed price history array
 *
 * @example
 * morphPriceHistoryArray([{
 *   date: "2024-05-01T03:54:42.598Z",
 *   amount: 3.99
 *  }})
 *
 *  returns [{ "2024-05-01T03:54:42.598Z": 3.99 }]
 */
const morphPriceHistoryArray = (priceHistory: IPriceHistoryArray[]) => {
	return priceHistory.map((price: IPriceHistoryArray) => {
		return {
			[new Date(price.date).toISOString()]: price.amount,
		};
	});
};

export default morphPriceHistoryArray;
