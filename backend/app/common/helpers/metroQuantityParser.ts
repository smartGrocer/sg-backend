interface QuantityResponse {
	quant_uom: string | null;
	quant_value: number;
	pack_size: number;
}

const metroQuantityParser = (quantity: string): QuantityResponse => {
	// variations
	// N/A, 1 un,Sold individually,12 un,397 g,8 un - 528 g,325 mL

	// if quantity is N/A, return 0
	if (quantity === "N/A") {
		return { quant_value: 0, quant_uom: null, pack_size: 1 };
	}

	// if quantity is sold individually, return 1
	if (quantity === "Sold individually") {
		return { quant_value: 1, quant_uom: null, pack_size: 1 };
	}

	// if g, ml, L, kg, return the quantity and unit
	const regex = /(\d+\.?\d*)\s*(g|ml|L|kg)/;
	const match = quantity.match(regex);
	if (match) {
		return {
			quant_value: parseFloat(match[1]),
			quant_uom: match[2],
			pack_size: 1,
		};
	}

	// 24x135 sheets
	const regex2 = /(\d+)x(\d+)\s*(\w+)/;
	const match2 = quantity.match(regex2);
	if (match2) {
		return {
			quant_value: parseInt(match2[2]),
			quant_uom: match2[3],
			pack_size: parseInt(match2[1]),
		};
	}

	// base case
	// if quantity can't be parsed, return 0
	return { quant_value: 0, quant_uom: null, pack_size: 1 };
};

export default metroQuantityParser;
