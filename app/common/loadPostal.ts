const fs = require('fs');

const JSONInput = "app/data/CanadianPostalCodes.json";
const data = fs.readFileSync(JSONInput, "utf-8");
const postalDataMap = JSON.parse(data);

export function getPostalcode(postalcode: string) {
	return postalDataMap[postalcode];
}
