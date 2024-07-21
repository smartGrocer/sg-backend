import supertest from "supertest";
import app from "../../index";
import { AllParentCompanyList } from "../../common/types/common/store";

describe("Route /store", () => {
	describe("GET /api", () => {
		it("should return a message", async () => {
			const response = await supertest(app).get("/api");
			expect(response.status).toBe(200);
			expect(response.body.message).toBe(
				"Welcome to the Crawler Service. Please use one of the available routes"
			);

			expect(response.body.availableRoutes).toMatchObject({
				stores: "/api/stores/:parent_company/:chain?postal_code=postal_code&distance=5000",
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
			describe("when parent_company is missing", () => {
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
							"Invalid parent_company, please provide a valid parent_company."
						);
						expect(response.body.availableOptions).toEqual(
							Object.values(AllParentCompanyList)
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
					}, 30000);
				});
			});
		});

		describe("when query includes valid parent_company", () => {});
	});
});
