import getSecret, { SecretType } from "./getSecret";

describe("getSecret", () => {
	it("should return the secret when it exists", () => {
		const secret = "my-secret";
		process.env.UPSTASH_PORT = secret;

		const result = getSecret("UPSTASH_PORT");

		expect(result).toBe(secret);
		expect(typeof result).toBe("string");
	});

	it("should throw an error when the secret does not exist", () => {
		try {
			getSecret("NON_EXISTENT_SECRET" as SecretType);
		} catch (e: unknown) {
			if (e instanceof Error) {
				expect(e.message).toBe("Secret not found: NON_EXISTENT_SECRET");
			}
		}
	});

	it("should throw an error when the secret is empty", () => {
		process.env.PORT = "";

		try {
			getSecret("PORT");
		} catch (e: unknown) {
			if (e instanceof Error) {
				expect(e.message).toBe("Secret not found: PORT");
			}
		}
	});
});
