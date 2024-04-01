import fs from "fs";

const JSONInput = "app/data/CanadianPostalCodes.json";
const data = fs.readFileSync(JSONInput, "utf-8");
const postalDataMap = JSON.parse(data);

export interface IPostalDataImport {
	lat: string;
	lng: string;
	city: string;
	province: string;
}

const getPostalcode = (postalcode: string): IPostalDataImport | null => {
	const postalCodeData = postalDataMap[postalcode];
	if (postalCodeData) {
		return postalCodeData;
	}

	return null;
};

export default getPostalcode;
