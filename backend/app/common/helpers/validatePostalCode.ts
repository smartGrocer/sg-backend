export type TValidPostalCode = string | false;

// postal code has to be A1A 1A1 format. Ensure that the postal code is in the correct format
export const validatePostalCode = (postalCode: string): TValidPostalCode => {
	// Remove spaces from the input and convert to uppercase
	const sanitizedInput = postalCode.replace(/\s/g, "").toUpperCase();

	// Check if the input matches the postal code pattern
	const postalCodePattern = /^[A-Z]\d[A-Z]\d[A-Z]\d$/;
	if (!postalCodePattern.test(sanitizedInput)) {
		return false;
	}

	// If the input is valid, return the sanitized postal code
	return sanitizedInput;
};
