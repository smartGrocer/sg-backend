export type SecretType =
	| "PORT"
	| "UPSTASH_PORT"
	| "UPSTASH_ENDPOINT"
	| "UPSTASH_PASSWORD"
	| "PANDA_BROWSER_URL";

const getSecret = (secretType: SecretType): string => {
	// get the secret from the environment variables
	const secret = process.env[secretType];

	if (secretType === "PORT" && process.env.NODE_ENV === "test") {
		return "6000";
	}
	// if the secret is not found, throw an error
	if (!secret) {
		throw new Error(`Secret not found: ${secretType}`);
	}

	// return the secret
	return secret;
};

export default getSecret;
