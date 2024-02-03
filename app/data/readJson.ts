const JSONInput = "app/data/CanadianPostalCodes.json";
import fs from "fs/promises";

export const getCoordinatesFromPostal = async (postalCode: string) => {
    // read it line by line and parse it, if found return it
    const data = await fs.readFile(JSONInput, "utf-8") as unknown as string;
	const formattedPostalCode = formatPostalCode(postalCode);

	const postalData = JSON.parse(data)[formattedPostalCode];

	if (postalData) {
		return {
            postalData,
            postalCode,
            formattedPostalCode,
        };
	} else {
		return null;
	}
};

export const formatPostalCode = (postalCode: string) => {
	// format 1a1a1a into 1A1 A1A
	const firstPart = postalCode.slice(0, 3).toUpperCase();
	const secondPart = postalCode.slice(3, 6).toUpperCase();
	return `${firstPart} ${secondPart}`;
};
