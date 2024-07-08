import express from "express";
import getStores from "../controllers/getStores";
import fallBackRoute from "../controllers/fallbackRoute";
import scrapeStores from "../controllers/scrapeStore";
import getAllProducts from "../controllers/getAllProducts";
import getSpecificProduct from "../controllers/getSpecificProduct";

const router = express.Router();

// Routes
router.get("/api/stores/:chain_brand?/:chain?", getStores);

router.get("/api/products/all", getAllProducts);

router.get("/api/product/:id", getSpecificProduct);

router.get("/api/scrape", scrapeStores);

router.get("*", fallBackRoute);

export default router;
