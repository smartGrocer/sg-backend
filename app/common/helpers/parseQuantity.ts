interface ParsedQuantity {
	quantity: number;
	unit: string;
}

const normalizeUnit = (unit: string): string => {
	const unitMap: { [key: string]: string } = {
		kilo: "kg",
		kilos: "kg",
		gram: "g",
		grams: "g",
		liter: "l",
		liters: "l",
		lt: "l",
		lts: "l",
		each: "un",
		eaches: "un",
		units: "un",
		ml: "ml",
		milliliter: "ml",
		milliliters: "ml",
		mls: "ml",
	};

	return unitMap[unit.toLowerCase()] || unit.toLowerCase();
};

const parseQuantity = (input: string): ParsedQuantity => {
	const regex = /^([\d.]+)\s*(x)?\s*([\d.]+)?\s*(\w+)?\.?$/i;
	const match = input.match(regex);

	const units = ["kg", "g", "ml", "l", "each", "un"];

	let quantity: number;
	let unit: string;

	if (match) {
		if (match[2] === "x" && match[3]) {
			quantity = parseFloat(match[3]);
			unit = match[4] || "";
		} else if (match[1] && match[4]) {
			quantity = parseFloat(match[1]);
			const [unit1, unit2] = match[4].split(" ");
			unit = unit1 || unit2;
		} else if (match[1] && !match[4]) {
			quantity = parseFloat(match[1]);
			unit = "un";
		} else {
			quantity = 1;
			unit = match[4] || "un";
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

	return { quantity, unit };
};

export default parseQuantity;
