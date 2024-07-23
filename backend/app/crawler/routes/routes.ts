import express from "express";
import getStores from "../controllers/getStores";
import fallBackRoute from "../controllers/fallbackRoute";
import scrapeStores from "../controllers/scrapeStore";
import getAllProducts from "../controllers/getAllProducts";
import getSpecificProduct from "../controllers/getSpecificProduct";

const router = express.Router();

// Routes
router.get("/stores/:parent_company?/:flag?", getStores);

router.get("/products/all", getAllProducts);

router.get("/product/:id", getSpecificProduct);

router.get("/scrape", scrapeStores);

router.get("*", fallBackRoute);

export default router;
