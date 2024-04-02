/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/*.test.ts"],
	setupFiles: ["<rootDir>/.jest/setupEnv.ts"],
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	// collectCoverage: true,
	coverageDirectory: "coverage",
	collectCoverageFrom: [
		"app/**/*.{js,jsx,ts,tsx}",
		"!<rootDir>/node_modules/",
		"!<rootDir>/coverage/",
	],
};
