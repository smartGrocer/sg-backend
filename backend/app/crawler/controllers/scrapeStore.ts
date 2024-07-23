import { Request, Response } from "express";
import { AllParentCompanyList } from "../../common/types/common/store";
import { LoblawsFlagName } from "../../common/types/loblaws/loblaws";
import { MetroFlags } from "../../common/types/metro/metro";
import scrapeLoblaws from "../fetch/crawl/loblaws/scrapeLoblaws";
import scrapeMetro from "../fetch/crawl/metro/scrapeMetro";

const scrapeStores = async (req: Request, res: Response) => {
	const { query } = req;
	const chainName = query.chain as LoblawsFlagName | MetroFlags;

	if (!chainName) {
		return res.status(400).json({
			message: `Chain name is required, please provide a chain name as a query parameter like so: /scrape?chain=chain_name`,
			availableOptions: [...Object.values(LoblawsFlagName)],
		});
	}

	if (Object.values(LoblawsFlagName).includes(chainName as LoblawsFlagName)) {
		const response = await scrapeLoblaws(chainName as LoblawsFlagName);

		if (response instanceof Error) {
			return res.status(500).json({
				message: "Error scraping loblaws",
				error: response,
			});
		}

		return res.status(200).json({
			message: "Loblaws scraped successfully",
			count: response.length,
			data: response,
		});
	}

	if (Object.values(MetroFlags).includes(chainName as MetroFlags)) {
		const response = await scrapeMetro(chainName as MetroFlags);
		if (response instanceof Error) {
			return res.status(500).json({
				message: "Error scraping metro",
				error: response,
			});
		}

		return res.status(200).json({
			message: "Metro scraped successfully",
			count: response.length,
			data: response,
		});
	}

	return res.status(400).json({
		message: `Invalid chain name, please provide a valid chain name as a query parameter like so: /scrape?chain=chain_name`,
		availableOptions: [...Object.values(AllParentCompanyList)],
	});
};

export default scrapeStores;
