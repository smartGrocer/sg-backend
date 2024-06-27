import express from "express";
import getStores from "../controllers/getStores";
import fallBackRoute from "../controllers/fallbackRoute";
import scrapeStores from "../controllers/scrapeStore";

const router = express.Router();

// Routes
router.get("/stores/:chain_brand?/:chain?", getStores);

router.get("/scrape", scrapeStores);

router.get("*", fallBackRoute);

export default router;
