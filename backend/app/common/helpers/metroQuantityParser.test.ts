import metroQuantityParser from "./metroQuantityParser";

describe("metroQuantityParser", () => {
	describe("when quantity is N/A", () => {
		it("should return 0", () => {
			const result = metroQuantityParser("N/A");
			expect(result).toEqual({
				quant_value: 0,
				quant_uom: null,
				pack_size: 1,
			});
		});
	});

	describe("when quantity is Sold individually", () => {
		it("should return 1", () => {
			const result = metroQuantityParser("Sold individually");
			expect(result).toEqual({
				quant_value: 1,
				quant_uom: null,
				pack_size: 1,
			});
		});
	});

	describe("when quantity is the format with x like 10x180 mL or 100 un x 50 mg", () => {
		it("should return the correct values", () => {
			const inputs = [
				{
					input: "10x180 mL",
					expected: {
						quant_value: 180,
						quant_uom: "mL",
						pack_size: 10,
					},
				},
				{
					input: "100 un x 50 mg",
					expected: {
						quant_value: 50,
						quant_uom: "mg",
						pack_size: 100,
					},
				},
				{
					input: "24x135 sheets",
					expected: {
						quant_value: 135,
						quant_uom: "sheets",
						pack_size: 24,
					},
				},
			];

			for (const { input, expected } of inputs) {
				const result = metroQuantityParser(input);
				expect(result).toEqual(expected);
			}
		});
	});

	describe("when quantity is the format with g, ml, L, kg like 397 g, 325 mL", () => {
		it("should return the correct values", () => {
			const inputs = [
				{
					input: "397 g",
					expected: {
						quant_value: 397,
						quant_uom: "g",
						pack_size: 1,
					},
				},
				{
					input: "325 mL",
					expected: {
						quant_value: 325,
						quant_uom: "mL",
						pack_size: 1,
					},
				},
				{
					input: "1 L",
					expected: {
						quant_value: 1,
						quant_uom: "L",
						pack_size: 1,
					},
				},
				{
					input: "0.5 kg",
					expected: {
						quant_value: 0.5,
						quant_uom: "kg",
						pack_size: 1,
					},
				},
				{
					input: "18 un",
					expected: {
						quant_value: 18,
						quant_uom: "un",
						pack_size: 1,
					},
				},
			];

			for (const { input, expected } of inputs) {
				const result = metroQuantityParser(input);
				expect(result).toEqual(expected);
			}
		});
	});

	describe("when quantity is the format with a dash like '473 mL  - can' or '8 un - 528 g'", () => {
		it("should return the correct values", () => {
			const inputs = [
				{
					input: "473 mL  - can",
					expected: {
						quant_value: 473,
						quant_uom: "mL",
						pack_size: 1,
					},
				},
				{
					input: "8 un - 528 g",
					expected: {
						quant_value: 528,
						quant_uom: "g",
						pack_size: 8,
					},
				},
				{
					input: "12 un - 1.2 kg",
					expected: {
						quant_value: 1.2,
						quant_uom: "kg",
						pack_size: 12,
					},
				},
				{
					input: "120 un - gummies",
				},
			];

			for (const { input, expected } of inputs) {
				const result = metroQuantityParser(input);
				expect(result).toEqual(expected);
			}
		});
	});

	describe("when quantity is a sentence like 'A bag contains on average 1000 g'", () => {});

	describe("when quantity is a unique unit like 1 bunch", () => {});
});
