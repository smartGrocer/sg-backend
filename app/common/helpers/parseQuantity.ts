interface ParsedQuantity {
	quantity: number;
	unit: string;
	price?: number;
	price_unit?: string;
}

const normalizeUnit = (unit: string): string => {
	const unitMap: { [key: string]: string } = {
		kilo: "kg",
		kilos: "kg",
		kg: "kg",
		k: "kg",
		kgs: "kg",
		gram: "g",
		grams: "g",
		g: "g",
		gs: "g",
		grms: "g",
		grm: "g",
		gms: "g",
		gm: "g",
		liter: "l",
		liters: "l",
		lt: "l",
		lts: "l",
		each: "un",
		eaches: "un",
		units: "un",
		unit: "un",
		ml: "ml",
		milliliter: "ml",
		milliliters: "ml",
		mls: "ml",
	};

	return unitMap[unit.toLowerCase()] || unit.toLowerCase();
};

const parseQuantity = (input: string): ParsedQuantity => {
	const quantityRegex = /^([\d.]+)\s*(x)?\s*([\d.]+)?\s*(\w+)?\.?$/i;
	const priceRegex = /\$([\d.]+)\/(\d+)?(\w+)/i;
	const matchQuantity = input.match(quantityRegex);
	const matchPrice = input.match(priceRegex);

	const units = ["kg", "g", "ml", "l", "each", "un"];

	let quantity: number = 0;
	let unit: string = "";
	let price: number | undefined;
	let priceUnit: string | undefined;

	if (matchQuantity) {
		if (matchQuantity[2] === "x" && matchQuantity[3]) {
			quantity = parseFloat(matchQuantity[3]);
			unit = matchQuantity[4] || "";
		} else if (matchQuantity[1] && matchQuantity[4]) {
			quantity = parseFloat(matchQuantity[1]);
			const [unit1, unit2] = matchQuantity[4].split(" ");
			unit = unit1 || unit2;
		} else if (matchQuantity[1] && !matchQuantity[4]) {
			quantity = parseFloat(matchQuantity[1]);
			unit = "un";
		}
	} else if (units.includes(input.trim().toLowerCase())) {
		quantity = 1;
		unit = input.trim().toLowerCase();
	} else {
		quantity = 1;
		unit = "un";
	}

	// Normalize units
	unit = normalizeUnit(unit);

	if (matchPrice) {
		price = parseFloat(matchPrice[1]);
		// eslint-disable-next-line prefer-destructuring
		priceUnit = matchPrice[3];
	}

	return { quantity, unit, price, price_unit: priceUnit };
};

export default parseQuantity;

// "$1.52/1kg $0.69/1lb" => { quantity: 1, unit: "kg", price: 1.52, price_unit: "kg" }
// "1 ea, $1.99/1ea" => { quantity: 1, unit: "un", price: 1.99, price_unit: "un" }
// "454 g, $0.44/100g" => { quantity: 454, unit: "g", price: 0.44, price_unit: "100g" }
// "12 ea, $0.32/1ea" => { quantity: 12, unit: "un", price: 0.32, price_unit: "un" }
// "$4.39/1kg $1.99/1lb" => { quantity: 1, unit: "kg", price: 4.39, price_unit: "kg" }
// "1.36 kg, $0.29/100g" => { quantity: 1.36, unit: "kg", price: 0.29, price_unit: "100g" }
// "3 pack, $1.83/1ea" => { quantity: 3, unit: "un", price: 1.83, price_unit: "un" }
// "1 bunch, $1.49/1ea" => { quantity: 1, unit: "un", price: 1.49, price_unit: "un" }
// "$5.49/1kg $2.49/1lb" => { quantity: 1, unit: "kg", price: 5.49, price_unit: "kg" }
// "4 l, $0.15/100ml" => { quantity: 4, unit: "l", price: 0.15, price_unit: "100ml" }
