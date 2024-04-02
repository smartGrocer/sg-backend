import supertest from "supertest";
import {
	mockGetCachedData,
	mockSaveToCache,
	mockConnectToRedis,
} from "../../../.jest/setupEnv";
import app from "../../index";
import { AllStoreChainBrands } from "../../common/types/common/store";

describe("Route /store", () => {
	beforeAll(() => {
		mockGetCachedData.mockImplementation(() => null);
		mockSaveToCache.mockImplementation(() => null);
		mockConnectToRedis.mockImplementation(() => null);
	});
	describe("GET /api", () => {
		it("should return a message", async () => {
			const response = await supertest(app).get("/api");
			expect(response.status).toBe(200);
			expect(response.body.message).toBe(
				"Welcome to the Crawler Service. Please use one of the available routes"
			);

			expect(response.body.availableRoutes).toMatchObject({
				stores: "/stores/:chain_brand/:chain?postal_code=postal_code&distance=5000",
				product_search:
					"/product/search/:product_search?chain=chain_name&store_id=1234",
				product_lookup:
					"/product/lookup?product_id=1234&url=www.example.com/product/id/1234&chain=chain_name",
			});
		});

		describe("GET /api/*", () => {
			it("should return a message", async () => {
				const response = await supertest(app).get("/api/invalid");

				expect(response.status).toBe(200);
				expect(response.body.message).toBe(
					"Welcome to the Crawler Service. Please use one of the available routes"
				);
			});

			it("should return a message", async () => {
				const response = await supertest(app).get("/api/test");

				expect(response.status).toBe(200);
				expect(response.body.message).toBe(
					"Welcome to the Crawler Service. Please use one of the available routes"
				);
			});
		});
	});

	describe("GET /api/stores", () => {
		describe("when query params are missing or incorrect", () => {
			describe("when chain_brand is missing", () => {
				it("should throw an error", async () => {
					const routesInputs = [
						"/api/stores",
						"/api/stores/invalid",
						"/api/stores/",
					];

					for await (const route of routesInputs) {
						const response = await supertest(app).get(route);

						expect(response.status).toBe(400);
						expect(response.body.message).toBe(
							"Invalid chain brand, please provide a valid chain brand."
						);
						expect(response.body.availableOptions).toEqual(
							Object.values(AllStoreChainBrands)
						);
					}
				});
			});

			describe("when postal_code is missing or is invalid", () => {
				describe("when postal_code is not formatted correctly", () => {
					it("should throw an error", async () => {
						const routesInputs = [
							"/api/stores/metro?postal_code=invalid",
							"/api/stores/loblaws?postal_code=l5b444",
							"/api/stores/walmart?postal_code=l5v-2b4",
						];
						for await (const route of routesInputs) {
							const response = await supertest(app).get(route);

							expect(response.status).toBe(400);
							expect(response.body.message).toMatch(
								/Invalid postal code. Please provide a valid postal code/
							);
							const postalCode = route
								.split("?")[1]
								.split("=")[1];
							expect(response.body.data).toMatch(
								new RegExp(
									`postal_code=${postalCode} might be invalid. Please provide a valid postal code.`
								)
							);
						}
					});
				});

				describe("when postal_code is not valid or not found", () => {
					it("should throw an error", async () => {
						const routesInputs = [
							"/api/stores/metro?postal_code=m1a2b2",
							"/api/stores/loblaws?postal_code=z1a2b3",
							"/api/stores/walmart?postal_code=z1y2x3",
						];
						for await (const route of routesInputs) {
							const response = await supertest(app).get(route);

							expect(response.status).toBe(400);
							expect(response.body.message).toMatch(
								/Invalid postal code or postal code not found. Please provide a valid postal code/
							);
							const postalCode = route
								.split("?")[1]
								.split("=")[1];

							expect(response.body.data).toMatch(
								new RegExp(
									`postal_code=${postalCode} might be invalid or could not be found. Please provide a valid postal code.`
								)
							);
						}
					});
				});

				describe("when postal_code is correct", () => {
					it("should return a message", async () => {
						const response = await supertest(app).get(
							"/api/stores/metro/metro?postal_code=l5b4a1"
						);

						expect(response.status).toBe(200);
						expect(response.body.message).not.toMatch(
							/Invalid postal code or postal code not found. Please provide a valid postal code/
						);
					});
				});
			});
		});

		describe("when query includes valid chain_brands", () => {});
	});
});
