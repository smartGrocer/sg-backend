/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/*.test.ts"],
	globals: {
		"ts-jest": {
			tsconfig: "tsconfig.json",
		},
	},
	collectCoverage: true,
	coverageDirectory: "coverage",
	collectCoverageFrom: [
		"app/**/*.{js,jsx,ts,tsx}",
		"!<rootDir>/node_modules/",
	],
};
