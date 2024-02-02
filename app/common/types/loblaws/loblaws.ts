export enum LoblawsChainName {
	loblaw = "loblaw",
	zehrs = "zehrs",
	valumart = "valumart",
	nofrills = "nofrills",
	rass = "rass", //atlantic superstore
	dominion = "dominion", //newfoundlandgrocerystores
	wholesaleclub = "wholesaleclub",
	independent = "independent",
	fortinos = "fortinos",
	superstore = "superstore",
	maxi = "maxi",
	provigo = "provigo",
	extrafoods = "extrafoods",
}

export interface LoblawsStore {
	chainName: LoblawsChainName;
}

export interface IStoreLoblawsSrcProps {
	id: string;
	storeId: string;
	storeBannerId: string;
	geoPoint: {
		latitude: number;
		longitude: number;
	};
	address: {
		formattedAddress: string;
		town: string;
		line1: string;
		line2: string;
		postalCode: string;
		region: string;
		country: string;
	};
}
