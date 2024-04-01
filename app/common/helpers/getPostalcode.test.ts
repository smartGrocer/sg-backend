import getPostalcode, { IPostalDataImport } from "./getPostalcode";

describe("getPostalcode", () => {
	const runTest = (
		testInputs: {
			input: string;
			expected: IPostalDataImport;
		}[]
	): void => {
		testInputs.forEach(({ input, expected }) => {
			it(`should return ${JSON.stringify(expected)} when input is "${input}"`, () => {
				expect(getPostalcode(input)).toEqual(expected);
			});
		});
	};

	describe("when an invalid postal code is inputted", () => {
		const testInputs = [
			{
				input: "a1a1a1a",
				expected: null as unknown as IPostalDataImport,
			},
			{ input: "1a1a1a", expected: null as unknown as IPostalDataImport },
			{ input: "a1a1aa", expected: null as unknown as IPostalDataImport },
			{ input: "a1a1a", expected: null as unknown as IPostalDataImport },
			{ input: "a1a1", expected: null as unknown as IPostalDataImport },
			{ input: "a1a", expected: null as unknown as IPostalDataImport },
			{ input: "a1", expected: null as unknown as IPostalDataImport },
			{ input: "1", expected: null as unknown as IPostalDataImport },
			{ input: "a", expected: null as unknown as IPostalDataImport },
			{ input: "", expected: null as unknown as IPostalDataImport },
		];

		runTest(testInputs);
	});

	describe("when a valid postal code is inputted", () => {
		const testInputs = [
			{
				input: "K8A 5S5",
				expected: {
					lat: "45.824567",
					lng: "-77.112759",
					city: "PEMBROKE",
					province: "ON",
				},
			},
			{
				input: "A1C 4J5",
				expected: {
					lat: "47.565875",
					lng: "-52.718253",
					city: "ST. JOHN'S",
					province: "NL",
				},
			},

			{
				input: "K2S 1Y2",
				expected: {
					lat: "45.268747",
					lng: "-75.905741",
					city: "STITTSVILLE",
					province: "ON",
				},
			},
			{
				input: "M1N 3L7",
				expected: {
					lat: "43.702278",
					lng: "-79.261496",
					city: "SCARBOROUGH",
					province: "ON",
				},
			},
			{
				input: "G9P 2M8",
				expected: {
					lat: "46.524005",
					lng: "-72.754518",
					city: "SHAWINIGAN-SUD",
					province: "QC",
				},
			},
		];

		runTest(testInputs);
	});
});
