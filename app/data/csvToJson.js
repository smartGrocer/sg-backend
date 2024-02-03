var csvFilePath = "app/data/CanadianPostalCodes.csv";
const saveJsonFilePath = "app/data/CanadianPostalCodes.json";
var csv = require("csvtojson");
const fs = require('fs');

var count = 0;

const outputJson = {};

csv()
	.fromFile(csvFilePath)
	.then(function (jsonObj) {
		jsonObj.forEach(function (element) {
            outputJson[element.POSTAL_CODE] = {
                lat: element.LATITUDE,
                lng: element.LONGITUDE,
                city: element.CITY,
                province: element.PROVINCE_ABBR
            };
		});
	}).then(function () {
        // save to json file 
        fs.writeFile(saveJsonFilePath, JSON.stringify(outputJson), function (err) {
            if (err) {
                console.log(err);
            }
        });

    });






// // Async / await usage
// (async () => {
// 	// const jsonArray = await csv().fromFile(csvFilePath);
//     console.log(jsonArray);
// })();
