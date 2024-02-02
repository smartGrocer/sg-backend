export interface IStoreProps{
    id: string;
    store_id: string;
    chain_name: string;
    latitude: number;
    longitude: number;
    formatted_address: string;
    city: string;
    line1: string;
    line2: string;
    postal_code: string;
    province: string;
    country: string;
}

export interface IStoreSrcProps{
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



export interface IStoreResponse{
    count: number;
    stores: IStoreProps[];
}