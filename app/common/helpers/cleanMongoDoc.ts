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

	const cleanedDoc = doc.toObject();
	// eslint-disable-next-line no-underscore-dangle
	delete cleanedDoc._id;
	// eslint-disable-next-line no-underscore-dangle
	delete cleanedDoc.__v;
	return cleanedDoc;
};

export default cleanMongoDoc;
