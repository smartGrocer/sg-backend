import { IStoreProps } from "../types/common/store";
import { IPostalData, IPostalDataWithDate } from "./getPostalCode";
import { getDistance } from "geolib";

interface IFilterStoresByLocation {
	stores: IStoreProps[];
	distance: number;
	userCoordinates: IPostalData;
}

const filterStoresByLocation = ({
	stores,
	distance,
	userCoordinates,
}: IFilterStoresByLocation): IStoreProps[] => {
	const { lat, lng } = userCoordinates;
	// const { lat, lng } = data;

	// add distance to each store
	const storesWithinDistance = stores
		.map((store) => {
			const distance_from_user =
				getDistance(
					{ latitude: Number(lat), longitude: Number(lng) },
					{
						latitude: Number(store.latitude),
						longitude: Number(store.longitude),
					}
				) / 1000;
			return {
				...store,
				distance_from_user: distance_from_user,
			};
		})
		.filter((store) => store.distance_from_user <= distance / 1000)
		.sort((a, b) => a.distance_from_user - b.distance_from_user);

	return storesWithinDistance;
};

export default filterStoresByLocation;
