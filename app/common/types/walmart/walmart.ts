export interface IStoreWalmartSrcProps {
	id: string;
	// storeId: string;
	displayName: string;
	storeBannerId: string;
	geoPoint: {
		latitude: number;
		longitude: number;
	};
	address: {
		city: string;
		address1: string;
		address6: string;
		postalCode: string;
		state: string;
		country: string;
	};
}
