import { TValidPostalCode, validatePostalCode } from "./validatePostalCode";

describe("validatePostalCode", () => {
	const runTest = (
		testInputs: {
			input: string;
			expected: TValidPostalCode;
		}[]
	): void => {
		testInputs.forEach(({ input, expected }) => {
			it(`should return ${JSON.stringify(expected)} when input is "${input}"`, () => {
				expect(validatePostalCode(input)).toEqual(expected);
			});
		});
	};
	describe("when the inputs have spaces or not", () => {
		const testInputs = [
			{ input: "A1A 1A1", expected: "A1A1A1" },
			{ input: "A1A 1A1 ", expected: "A1A1A1" },
			{ input: " A1A 1A1", expected: "A1A1A1" },
			{ input: " A1A 1A1 ", expected: "A1A1A1" },
			{ input: "A1A1A1", expected: "A1A1A1" },
			{ input: "A1A1A1 ", expected: "A1A1A1" },
			{ input: " A1A1A1", expected: "A1A1A1" },
			{ input: " A1A1A1 ", expected: "A1A1A1" },
			{ input: "A1B2C3", expected: "A1B2C3" },
			{ input: "z9y8x7", expected: "Z9Y8X7" },
		];
		runTest(testInputs);
	});

	describe("when the inputs are invalid", () => {
		const testInputs = [
			{ input: "11A1A", expected: false as TValidPostalCode },
			{ input: "A1A1A", expected: false as TValidPostalCode },
			{ input: "A1A1A1A", expected: false as TValidPostalCode },
			{ input: "", expected: false as TValidPostalCode },
			{ input: "A", expected: false as TValidPostalCode },
			{ input: "123456", expected: false as TValidPostalCode },
		];
		runTest(testInputs);
	});
});
