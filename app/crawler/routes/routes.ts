import express from "express";
import getStores from "../controllers/getStores";
import fallBackRoute from "../controllers/fallbackRoute";
import scrapeStores from "../controllers/scrapeStore";
import getAllProducts from "../controllers/getAllProducts";
import getSpecificProduct from "../controllers/getSpecificProduct";
import catogorizeProduct from "../controllers/catogorizeProduct";

const router = express.Router();

// Routes
router.get("/stores/:chain_brand?/:chain?", getStores);

router.get("/products/all", getAllProducts);

router.get("/product/:id", getSpecificProduct);

router.get("/scrape", scrapeStores);

router.get("/catogorize/:id", catogorizeProduct);

router.get("*", fallBackRoute);

export default router;
