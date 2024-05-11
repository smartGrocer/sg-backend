import logger from "../logging/axiom";

//  sleep for min to max seconds
const sleep = ({
	min = 30,
	max = 120,
}: {
	min?: number;
	max?: number;
}): Promise<void> => {
	return new Promise((resolve) => {
		const waitFor = Math.floor(
			(Math.floor(Math.random() * (max - min)) + min) * 1000
		);

		logger.verbose({
			message: `Waiting for ${waitFor / 1000}s`,
		});
		setTimeout(resolve, waitFor);
	});
};

export default sleep;
