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

	const searchDistance = distance / 1000;

	// add distance to each store
	const storesWithinDistance = stores
		.map((store) => {
			const distance_from_user =
				getDistance(
					{ latitude: Number(lat), longitude: Number(lng) },
					{ latitude: store.latitude, longitude: store.longitude }
				) / 1000;

			return {
				...store,
				distance: distance_from_user,
			};
		})
		.filter((store) => store.distance <= searchDistance)
		.sort((a, b) => a.distance - b.distance);
		// .sort((a, b) => Number(a.store_id) - Number(b.store_id));

	return storesWithinDistance;
};

export default filterStoresByLocation;
