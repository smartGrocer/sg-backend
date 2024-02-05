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

export const LoblawsChainAlternateName = (
	chainBrand: LoblawsChainName
): string => {
	if (chainBrand === LoblawsChainName.superstore) {
		return "realcanadiansuperstore";
	}

	if (chainBrand === LoblawsChainName.independent) {
		return "yourindependentgrocer";
	}

	if (chainBrand === LoblawsChainName.loblaw) {
		return "loblaws";
	}

	if (chainBrand === LoblawsChainName.dominion) {
		return "newfoundlandgrocerystores";
	}

	if (chainBrand === LoblawsChainName.rass) {
		return "atlanticsuperstore";
	}

	return chainBrand;
};



export interface LoblawsStore {
	chainName: LoblawsChainName;
	showAllStores: boolean;
}

export interface IStoreLoblawsSrcProps {
	id: string;
	storeId: string;
	name: string;
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
