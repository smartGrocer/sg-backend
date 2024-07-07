import deleteKey from "../../../../common/helpers/deleteKey";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cleanLoblawsData = (data: any): { [key: string]: any } => {
	let newData = deleteKey({
		obj: data,
		keys: ["contentId", "viewMetaData", "theme"],
	});

	newData =
		newData?.layout?.sections?.productListingSection?.components[0]?.data;

	newData = deleteKey({
		obj: newData,
		keys: [
			"noResultsText",
			"breadcrumbs",
			"headline",
			"disclaimerText",
			"categoryNavigation",
			"filterGroups",
			"categoryNavigation",
			"filterGroups",
			"sorts",
			"quickFilters",
			"adConfiguration1",
			"adConfiguration2",
		],
	});

	newData = newData.productGrid;

	return newData;
};

export default cleanLoblawsData;
