/**
 * Clean a MongoDB document by removing _id and __v
 * @param doc - MongoDB document
 * @param keysToRemove - Keys to remove from the document. Type: string[]
 * @returns - Cleaned document
 */

//  doc is an object that has keys
interface IDoc {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

const cleanMongoDoc = ({
	doc,
	keysToRemove,
}: {
	doc: IDoc;
	keysToRemove: string[];
}): IDoc => {
	// const cleanedDoc = doc.toObject();
	const cleanedDoc = { ...doc };

	keysToRemove.forEach((key) => {
		delete cleanedDoc[key];
	});

	return cleanedDoc;
};

export default cleanMongoDoc;
