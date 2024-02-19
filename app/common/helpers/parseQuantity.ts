interface IParseQuantity {
	quantity: number;
	unit: string;
}

const parseQuantity = (quantity: string): IParseQuantity => {
	// if 3x29.0 g then return { quantity: 29 ,unit: "g" }

	if (quantity.includes("x")) {
		const quantityValue = parseFloat(quantity.split("x")[1].split(" ")[0]);
		const quantityUnit = quantity.split("x")[1].split(" ")[1];

		return {
			quantity: quantityValue,
			unit: quantityUnit,
		};
	}

	/*
	 *   inputs: un., 1kg, kg, 100ml, 1l, 1g, 1.5g, 2.99 each
	 *   outputs: { quantity: 1, unit: "un." }, { quantity: 1, unit: "kg" }, { quantity: 100, unit: "ml" }, { quantity: 1, unit: "l" }, { quantity: 1, unit: "g" }, { quantity: 1.5, unit: "g" }, { quantity: 2.99, unit: "each" }
	 */

	const quantityValue = parseFloat(quantity.replace(/[a-zA-Z]/g, "")) || 1;
	const quantityUnit = quantity.replace(/[0-9]/g, "").trim();

	return {
		quantity: quantityValue,
		unit: quantityUnit,
	};
};

export default parseQuantity;
