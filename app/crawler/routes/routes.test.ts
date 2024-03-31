import supertest from "supertest";
import {
	mockGetCachedData,
	mockSaveToCache,
	mockConnectToRedis,
} from "../../../.jest/setupEnv";
import app from "../../index";

describe("GET /ping", () => {
	it("should return pong", async () => {
		mockGetCachedData.mockImplementation(() => null);
		mockSaveToCache.mockImplementation(() => null);
		mockConnectToRedis.mockImplementation(() => null);

		const response = await supertest(app).get("/ping");

		expect(response.status).toBe(200);
		expect(response.body.message).toBe("pong");
	});
});
