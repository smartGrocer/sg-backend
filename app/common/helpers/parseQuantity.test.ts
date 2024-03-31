import parseQuantity from "./parseQuantity";

describe("parseQuantity", () => {
	const runTest = (
		testInputs: {
			input: string;
			expected: { quantity: number; unit: string };
		}[]
	): void => {
		testInputs.forEach(({ input, expected }) => {
			it(`should return ${JSON.stringify(expected)} when input is "${input}"`, () => {
				expect(parseQuantity(input)).toEqual(expected);
			});
		});
	};

	describe("when the inputs have different units", () => {
		const testInputs = [
			{ input: "1.5kg", expected: { quantity: 1.5, unit: "kg" } },
			{ input: "1.5kilo", expected: { quantity: 1.5, unit: "kg" } },
			{ input: "1.5kilos", expected: { quantity: 1.5, unit: "kg" } },
			{ input: "1.5g", expected: { quantity: 1.5, unit: "g" } },
			{ input: "1.5gram", expected: { quantity: 1.5, unit: "g" } },
			{ input: "1.5grams", expected: { quantity: 1.5, unit: "g" } },
			{ input: "1.5ml", expected: { quantity: 1.5, unit: "ml" } },
			{ input: "1.5l", expected: { quantity: 1.5, unit: "l" } },
			{ input: "1.5each", expected: { quantity: 1.5, unit: "un" } },
			{ input: "1.5eaches", expected: { quantity: 1.5, unit: "un" } },
			{ input: "1.5liter", expected: { quantity: 1.5, unit: "l" } },
			{ input: "1.5liters", expected: { quantity: 1.5, unit: "l" } },
			{ input: "1.5lt", expected: { quantity: 1.5, unit: "l" } },
			{ input: "1.5lts", expected: { quantity: 1.5, unit: "l" } },
			{ input: "1.5un.", expected: { quantity: 1.5, unit: "un" } },
			{ input: "1.5units", expected: { quantity: 1.5, unit: "un" } },
			{ input: "1.5milliliter", expected: { quantity: 1.5, unit: "ml" } },
			{
				input: "1.5milliliters",
				expected: { quantity: 1.5, unit: "ml" },
			},
			{ input: "1.5ml", expected: { quantity: 1.5, unit: "ml" } },
			{
				input: "1.5mls",
				expected: { quantity: 1.5, unit: "ml" },
			},
		];

		runTest(testInputs);
	});

	describe("when the inputs have space or not", () => {
		const testInputs = [
			{ input: "1.5 kg", expected: { quantity: 1.5, unit: "kg" } },
			{ input: "1.5kg", expected: { quantity: 1.5, unit: "kg" } },
			{ input: "1.5 g", expected: { quantity: 1.5, unit: "g" } },
			{ input: "1.5g", expected: { quantity: 1.5, unit: "g" } },
			{ input: "1.5 ml", expected: { quantity: 1.5, unit: "ml" } },
			{ input: "1.5ml", expected: { quantity: 1.5, unit: "ml" } },
			{ input: "1.5 l", expected: { quantity: 1.5, unit: "l" } },
			{ input: "1.5l", expected: { quantity: 1.5, unit: "l" } },
			{ input: "1.5 each", expected: { quantity: 1.5, unit: "un" } },
			{ input: "1.5each", expected: { quantity: 1.5, unit: "un" } },
			{ input: "1.5 un.", expected: { quantity: 1.5, unit: "un" } },
			{ input: "1.5un.", expected: { quantity: 1.5, unit: "un" } },
		];
		runTest(testInputs);
	});

	describe("when the input has x", () => {
		const testInputs = [
			{ input: "3x29.0 g", expected: { quantity: 29, unit: "g" } },
			{ input: "3x29.0g", expected: { quantity: 29, unit: "g" } },
			{ input: "3x29.0kg", expected: { quantity: 29, unit: "kg" } },
			{ input: "3x29.0 kg", expected: { quantity: 29, unit: "kg" } },
			{ input: "3x29.0 ml", expected: { quantity: 29, unit: "ml" } },
			{ input: "3x29.0 l", expected: { quantity: 29, unit: "l" } },
			{ input: "3x29.0 each", expected: { quantity: 29, unit: "un" } },
			{ input: "3x29 g", expected: { quantity: 29, unit: "g" } },
			{ input: "3x29g", expected: { quantity: 29, unit: "g" } },
			{ input: "3x29kg", expected: { quantity: 29, unit: "kg" } },
			{ input: "3x29 kg", expected: { quantity: 29, unit: "kg" } },
			{ input: "3x29 ml", expected: { quantity: 29, unit: "ml" } },
			{ input: "3x29 l", expected: { quantity: 29, unit: "l" } },
			{ input: "3x29 each", expected: { quantity: 29, unit: "un" } },
			{ input: "1x5 g", expected: { quantity: 5, unit: "g" } },
		];
		runTest(testInputs);
	});

	describe("when the input doesnt have x", () => {
		const testInputs = [
			{ input: "un.", expected: { quantity: 1, unit: "un" } },
			{ input: "1kg", expected: { quantity: 1, unit: "kg" } },
			{ input: "kg", expected: { quantity: 1, unit: "kg" } },
			{ input: "100ml", expected: { quantity: 100, unit: "ml" } },
			{ input: "1l", expected: { quantity: 1, unit: "l" } },
			{ input: "1g", expected: { quantity: 1, unit: "g" } },
			{ input: "1.5g", expected: { quantity: 1.5, unit: "g" } },
			{ input: "2.99 each", expected: { quantity: 2.99, unit: "un" } },
		];
		runTest(testInputs);
	});
	describe("when the input has no unit", () => {
		const testInputs = [
			{ input: "1", expected: { quantity: 1, unit: "un" } },
			{ input: "1.5", expected: { quantity: 1.5, unit: "un" } },
			{ input: "2", expected: { quantity: 2, unit: "un" } },
			{ input: "9.5", expected: { quantity: 9.5, unit: "un" } },
			{ input: "10", expected: { quantity: 10, unit: "un" } },
			{ input: "10.5", expected: { quantity: 10.5, unit: "un" } },
			{ input: "99", expected: { quantity: 99, unit: "un" } },
			{ input: "999", expected: { quantity: 999, unit: "un" } },
		];
		runTest(testInputs);
	});

	describe("when the input has no quantity", () => {
		const testInputs = [
			{ input: "kg", expected: { quantity: 1, unit: "kg" } },
			{ input: "g", expected: { quantity: 1, unit: "g" } },
			{ input: "ml", expected: { quantity: 1, unit: "ml" } },
			{ input: "l", expected: { quantity: 1, unit: "l" } },
			{ input: "each", expected: { quantity: 1, unit: "un" } },
			{ input: "un.", expected: { quantity: 1, unit: "un" } },
		];
		runTest(testInputs);
	});

	describe("when the input has no quantity and no unit", () => {
		const testInputs = [
			{ input: "", expected: { quantity: 1, unit: "un" } },
			{ input: "   ", expected: { quantity: 1, unit: "un" } },
		];

		runTest(testInputs);
	});

	describe("when the input is invalid", () => {
		const testInputs = [
			{ input: "1.5kgg", expected: { quantity: 1.5, unit: "kgg" } },
			{ input: "xyz", expected: { quantity: 1, unit: "un" } },
			{ input: "2x", expected: { quantity: 2, unit: "un" } },
		];

		runTest(testInputs);
	});
});
