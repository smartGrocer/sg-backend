// postal code has to be A1A 1A1 format. Ensure that the postal code is in the correct format
export const validatePostalCode = (postalCode: string): TValidPostalCode => {
	const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
	if (postalCodeRegex.test(postalCode)) {
		// return postal code without the space
		return postalCode.replace(" ", "");
	}
	return false;
};

export type TValidPostalCode = string | false;
