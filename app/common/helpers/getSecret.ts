type SecretType =
	| "PORT_API"
	| "PORT_CRAWLER"
	| "CRAWLER_URL"
	| "UPSTASH_PORT"
	| "UPSTASH_ENDPOINT"
	| "UPSTASH_PASSWORD";

const getSecret = (secretType: SecretType): string => {
	// get the secret from the environment variables
	const secret = process.env[secretType];

	// if the secret is not found, throw an error
	if (!secret) {
		throw new Error(`Secret not found: ${secretType}`);
	}

	// return the secret
	return secret;
};

export default getSecret;
