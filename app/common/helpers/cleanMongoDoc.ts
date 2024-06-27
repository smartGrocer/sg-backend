import { Document } from "mongoose";

/**
 * Clean a MongoDB document by removing _id and __v
 * @param doc - MongoDB document
 * @returns - Cleaned document
 */
const cleanMongoDoc = (doc: Document): Partial<Document> => {
	/**
	 * Remove _id and __v from the document
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { _id, __v, ...cleanedDoc } = doc.toObject();
	return cleanedDoc;
};

export default cleanMongoDoc;
