// import {
// 	mockConnectToRedis,
// 	mockGetCachedData,
// 	mockSaveToCache,
// } from "../../../.jest/setupEnv";
import {
	formatPostalCode,
	getCoordinatesFromPostal,
} from "./getCoordinatesFromPostal";

describe("getCoordinatesFromPostal", () => {
	// beforeAll(() => {
	// 	mockGetCachedData.mockImplementation(() => null);
	// 	mockSaveToCache.mockImplementation(() => null);
	// 	mockConnectToRedis.mockImplementation(() => null);
	// });

	describe("formatPostalCode", () => {
		it("should format the postal code correctly", () => {
			const testInputs = [
				{
					input: "a1a1a1",
					expected: "A1A 1A1",
				},
				{
					input: "a1a 1a1",
					expected: "A1A 1A1",
				},
				{
					input: "a1a-1a1",
					expected: "A1A 1A1",
				},
				{
					input: "a1a  1a1",
					expected: "A1A 1A1",
				},
				{
					input: "m1n 2b3",
					expected: "M1N 2B3",
				},
				{
					input: " z2n 4b5 ",
					expected: "Z2N 4B5",
				},
				{
					input: "z2X6B3",
					expected: "Z2X 6B3",
				},
				// Invalid postal codes with incorrect length
				{
					input: "a1a1a", // Too short
					expected: "A1A 1A", // Expected result has incorrect length
				},
				{
					input: "z2x6b38", // Too long
					expected: "Z2X 6B38", // Expected result has incorrect length
				},
				// Invalid postal codes with incorrect characters
				{
					input: "123456", // Only digits
					expected: "123 456",
				},
				{
					input: "ABC DEF", // Alphabets and space
					expected: "ABC DEF", // Should not be formatted
				},
				// Invalid postal codes with incorrect format
				{
					input: "a1a1 a1", // Space at an invalid position
					expected: "A1A 1A1", // Expected result is correct, but input is invalid
				},
				{
					input: "M1N-2B3", // Dash at an invalid position
					expected: "M1N 2B3", // Expected result is correct, but input is invalid
				},
			];

			testInputs.forEach((input) => {
				const result = formatPostalCode(input.input);
				expect(result).toBe(input.expected);
			});
		});
	});

	describe("getCoordinatesFromPostal", () => {
		it("should be null if postal code is invalid", async () => {
			const testInputs = [
				{
					input: "a1a1a1a",
					expected: null,
				},
				{
					input: "1a1a1a",
					expected: null,
				},
				{
					input: "a1a1aa",
					expected: null,
				},
				{
					input: "a1a1a",
					expected: null,
				},
				{
					input: "a1a1",
					expected: null,
				},
				{
					input: "a1a",
					expected: null,
				},
				{
					input: "a1",
					expected: null,
				},
				{
					input: "1",
					expected: null,
				},
				{
					input: "a",
					expected: null,
				},
				{
					input: "",
					expected: null,
				},
			];

			for await (const { input, expected } of testInputs) {
				const result = await getCoordinatesFromPostal(input);
				expect(result).toBe(expected);
			}
		});

		it("should return the correct coordinates if postal code is valid", async () => {
			const testInputs = [
				{
					input: "k8A 5s5",
					expected: {
						lat: "45.824567",
						lng: "-77.112759",
						city: "PEMBROKE",
						province: "ON",
						formattedPostalCode: "K8A 5S5",
						postalCode: "k8A 5s5",
					},
				},
				{
					input: "A1C4J5",
					expected: {
						lat: "47.565875",
						lng: "-52.718253",
						city: "ST. JOHN'S",
						province: "NL",
						formattedPostalCode: "A1C 4J5",
						postalCode: "A1C4J5",
					},
				},

				{
					input: " K2S1Y2 ",
					expected: {
						lat: "45.268747",
						lng: "-75.905741",
						city: "STITTSVILLE",
						province: "ON",
						formattedPostalCode: "K2S 1Y2",
						postalCode: " K2S1Y2 ",
					},
				},
				{
					input: "M1N 3L7",
					expected: {
						lat: "43.702278",
						lng: "-79.261496",
						city: "SCARBOROUGH",
						province: "ON",
						formattedPostalCode: "M1N 3L7",
						postalCode: "M1N 3L7",
					},
				},
				{
					input: "g9p 2m8",
					expected: {
						lat: "46.524005",
						lng: "-72.754518",
						city: "SHAWINIGAN-SUD",
						province: "QC",
						formattedPostalCode: "G9P 2M8",
						postalCode: "g9p 2m8",
					},
				},
			];

			for await (const { input, expected } of testInputs) {
				const result = await getCoordinatesFromPostal(input);
				expect(result).toEqual(expected);
			}
		});
	});
});
