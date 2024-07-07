import csv from "csvtojson";
import fs from "fs";

const csvFilePath = "app/data/CanadianPostalCodes.csv";
const saveJsonFilePath = "app/data/CanadianPostalCodes.json";

const outputJson = {};

csv()
	.fromFile(csvFilePath)
	.then((jsonObj) => {
		jsonObj.forEach((element) => {
			outputJson[element.POSTAL_CODE] = {
				lat: element.LATITUDE,
				lng: element.LONGITUDE,
				city: element.CITY,
				province: element.PROVINCE_ABBR,
			};
		});
	})
	.then(() => {
		// save to json file
		fs.writeFile(saveJsonFilePath, JSON.stringify(outputJson), (err) => {
			if (err) {
				console.log(err);
			}
		});
	});
