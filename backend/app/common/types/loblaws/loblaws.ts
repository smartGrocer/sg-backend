// eslint-disable-next-line import/no-cycle
import { IGetProduct, IGetProductProps, ISearchStore } from "../common/product";
// eslint-disable-next-line import/no-cycle
import getLoblawsStores from "../../../crawler/fetch/stores/loblaws/getStore";
import { IStoreProps } from "../common/store";

// eslint-disable-next-line no-shadow
export enum LoblawsChainName {
	loblaw = "loblaw",
	zehrs = "zehrs",
	valumart = "valumart",
	nofrills = "nofrills",
	rass = "rass", // atlantic superstore
	dominion = "dominion", // newfoundlandgrocerystores
	wholesaleclub = "wholesaleclub",
	independent = "independent",
	fortinos = "fortinos",
	superstore = "superstore",
	maxi = "maxi",
	provigo = "provigo",
	extrafoods = "extrafoods",
}

export interface ISearchLoblaws extends ISearchStore {
	chainName: LoblawsChainName;
}

export interface IGetProductLoblaws extends IGetProduct {
	chainName: LoblawsChainName;
}

export const LoblawsChainAlternateName = (
	flag_name: LoblawsChainName
): string => {
	if (flag_name === LoblawsChainName.superstore) {
		return "realcanadiansuperstore";
	}

	if (flag_name === LoblawsChainName.independent) {
		return "yourindependentgrocer";
	}

	if (flag_name === LoblawsChainName.loblaw) {
		return "loblaws";
	}

	if (flag_name === LoblawsChainName.dominion) {
		return "newfoundlandgrocerystores";
	}

	if (flag_name === LoblawsChainName.rass) {
		return "atlanticsuperstore";
	}

	return flag_name;
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

export interface ILoblawsProductSrcProps {
	code: string;
	name: string;
	description: string | null;
	brand: string;
	link: string;
	imageAssets: {
		imageUrl: string | null;
		smallUrl: string;
		mediumUrl: string;
		largeUrl: string;
		smallRetinaUrl: string;
		mediumRetinaUrl: string;
		largeRetinaUrl: string;
	}[];
	packageSize: string;
	shoppable: boolean;
	prices: {
		price: {
			value: number;
			unit: string;
			quantity: number;
			reasonCode: number;
			type: string;
			expiryDate: string;
		};
		wasPrice: {
			value: number;
			unit: string;
			quantity: number;
			reasonCode: null;
			type: string;
			expiryDate: string;
		} | null;

		comparisonPrices: {
			value: number;
			unit: string;
			quantity: number;
			reasonCode: null;
			type: string;
			expiryDate: null;
		}[];

		memberOnlyPrice: null;
		memberOnlyComparisonPrices: [];
	};
	pricingUnits: {
		type: string;
		unit: string;
		interval: number;
		minOrderQuantity: number;
		maxOrderQuantity: number;
		weighted: boolean;
	};
	badges: {
		textBadge: null;
		loyaltyBadge: null;
		dealBadge: null;
		newItemBadge: null;
	};
	stockStatus: string;
	articleNumber: string;
	ingredients: string | null;
	promotions: [];
	isVariant: boolean;
	offerType: string;
	variantTheme: null;
	hasMultipleOffers: boolean;
	sponsored: boolean;
	sponsoredCreative: null;
	aisle: null;
	sellerId: null;
	upcs: string[];
	sellerName: null;
	uom: string;
	taxes: null;
	fees: null;
}

export interface ILoblawsAllFoodProps {
	productId: string;
	productImage: {
		imageUrl: string;
		smallUrl: string;
		mediumUrl: string;
		largeUrl: string;
		smallRetinaUrl: string;
		mediumRetinaUrl: string;
		largeRetinaUrl: string;
	}[];
	brand: string | null;
	title: string;
	description: string | null;
	packageSizing: string;
	pricing: {
		price: string;
		wasPrice: null;
		displayPrice: string;
		memberOnlyPrice: null;
		mopDisplayPrice: null;
	};
	pricingUnits: {
		type: string;
		unit: string;
		interval: number;
		minOrderQuantity: number;
		maxOrderQuantity: number;
		weighted: boolean;
	};
	deal: {
		type: string;
		text: string;
		points: number;
		name: string;
		expiryDate: string;
		dealPrice: null;
	} | null;
	mopDeal: null;
	pcoDeal: null;
	inventoryIndicator: null;
	offerType: string;
	offerId: string;
	action: null;
	isVariant: boolean;
	link: string;
	productVendor: null;
	productVariant: null;
	textBadge: string;
	variantTheme: null;
	articleNumber: string;
	uom: string;
	sponsoredCreative: null;
	isSponsored: boolean;
	isComplementarySponsored: boolean;
	complementarySponsoredBadgeText: null;
	productBadge: null;
}

export const pickImage = (images: ILoblawsProductSrcProps["imageAssets"]) => {
	return (
		images.filter((img) => {
			return (
				img.imageUrl !== null ||
				img.smallUrl !== null ||
				img.mediumUrl !== null ||
				img.largeUrl !== null
			);
		})[0]?.imageUrl ||
		images.filter((img) => {
			return (
				img.imageUrl !== null ||
				img.smallUrl !== null ||
				img.mediumUrl !== null ||
				img.largeUrl !== null
			);
		})[0]?.smallUrl ||
		images.filter((img) => {
			return (
				img.imageUrl !== null ||
				img.smallUrl !== null ||
				img.mediumUrl !== null ||
				img.largeUrl !== null
			);
		})[0]?.mediumUrl ||
		images.filter((img) => {
			return (
				img.imageUrl !== null ||
				img.smallUrl !== null ||
				img.mediumUrl !== null ||
				img.largeUrl !== null
			);
		})[0]?.largeUrl
	);
};

export const validateLoblawsStoreId = async ({
	storeId,
	chainName,
}: {
	storeId: string;
	chainName: string;
}): Promise<{
	message: string;
	availableOptions?: string[];
	code: number;
}> => {
	const stores = await getLoblawsStores({
		chainName: chainName as LoblawsChainName,
		showAllStores: false,
	});

	if (stores instanceof Error) {
		return {
			message: stores.message,
			code: 500,
		};
	}

	if (!storeId) {
		return {
			message: `Store ID is required as a query parameter like so: /search/:product_search?store_num=1234`,
			availableOptions: [
				// remove duplicates
				...new Set<string>(
					stores.map((store: IStoreProps) => store.store_num).sort()
				),
			],
			code: 400,
		};
	}

	if (!stores.find((store) => store.store_num === storeId)) {
		return {
			message: `Store ID: ${storeId} is not valid for chain: ${chainName}`,
			availableOptions: [
				// remove duplicates
				...new Set<string>(
					stores.map((store: IStoreProps) => store.store_num).sort()
				),
			],
			code: 400,
		};
	}

	return {
		message: `Store ID: ${storeId} is valid for chain: ${chainName}`,
		code: 200,
	};
};

export interface IGetProductLoblawsProps extends IGetProductProps {
	chainName: LoblawsChainName;
}
