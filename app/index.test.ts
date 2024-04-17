import supertest from "supertest";
// import {
// 	mockGetCachedData,
// 	mockSaveToCache,
// 	mockConnectToRedis,
// } from "../.jest/setupEnv";
import app from "./index";

describe("index.ts", () => {
	// beforeAll(() => {
	// 	mockGetCachedData.mockImplementation(() => null);
	// 	mockSaveToCache.mockImplementation(() => null);
	// 	mockConnectToRedis.mockImplementation(() => null);
	// });

	describe("GET /ping", () => {
		it("should return pong", async () => {
			// mockGetCachedData.mockImplementation(() => null);
			// mockSaveToCache.mockImplementation(() => null);
			// mockConnectToRedis.mockImplementation(() => null);

			const response = await supertest(app).get("/ping");

			expect(response.status).toBe(200);
			expect(response.body.message).toBe("pong");
		});
	});

	describe("GET /", () => {
		it("should return a message", async () => {
			// mockGetCachedData.mockImplementation(() => null);
			// mockSaveToCache.mockImplementation(() => null);
			// mockConnectToRedis.mockImplementation(() => null);

			const response = await supertest(app).get("/");

			expect(response.status).toBe(200);
			expect(response.body.message).toMatch(
				/crawler-service is up and running/
			);
		});
	});
});
