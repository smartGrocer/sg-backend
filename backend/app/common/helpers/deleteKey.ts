const deleteKey = ({
	obj,
	keys,
}: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	obj: { [key: string]: any };
	keys: string[];
}): {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
} => {
	const newObj = { ...obj };
	keys.forEach((key) => delete newObj[key]);
	return newObj;
};

export default deleteKey;
