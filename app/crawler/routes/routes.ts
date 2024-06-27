import express from "express";
import getStores from "../controllers/getStores";
import fallBackRoute from "../controllers/fallbackRoute";
import scrapeStores from "../controllers/scrapeStore";
import getProductLookup from "../controllers/getProductLookup";
import getProductSearch from "../controllers/getProductSearch";

const router = express.Router();

// Routes
router.get("/stores/:chain_brand?/:chain?", getStores);

router.get("/product/search/:product_search?", getProductSearch);

router.get("/product/lookup", getProductLookup);

router.get("/scrape", scrapeStores);

router.get("*", fallBackRoute);

export default router;
