import dotenv from "dotenv";
import { getCachedData, saveToCache } from "../app/common/cache/storeCache";
import connectToRedis from "../app/common/cache/redis/connentRedis";
import connectDB from "../app/common/db/connectDB";
import Store from "../app/common/db/schema/store";
// For env File
dotenv.config();

// setup mock for redis
jest.mock("../app/common/cache/storeCache");
jest.mock("../app/common/cache/redis/connentRedis", () => {
	return jest.fn().mockResolvedValue({});
});
jest.mock("../app/common/db/connectDB", () => {
	return jest.fn().mockResolvedValue({});
});

jest.mock("../app/common/db/schema/store", () => {
	return {
		bulkWrite: jest.fn().mockResolvedValue({}),
	};
});

export const mockGetCachedData = getCachedData as jest.Mock;
export const mockSaveToCache = saveToCache as jest.Mock;
export const mockConnectToRedis = connectToRedis as jest.Mock;
export const mockConnectDB = connectDB as jest.Mock;
