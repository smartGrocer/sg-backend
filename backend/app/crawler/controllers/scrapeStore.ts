import { Request, Response } from "express";
import { AllParentCompanyList } from "../../common/types/common/store";
import { LoblawsFlagName } from "../../common/types/loblaws/loblaws";
import { MetroFlags } from "../../common/types/metro/metro";
import scrapeLoblaws from "../fetch/crawl/loblaws/scrapeLoblaws";
import scrapeMetro from "../fetch/crawl/metro/scrapeMetro";

const scrapeStores = async (req: Request, res: Response) => {
	const { query } = req;
	const flagName = query.flag as LoblawsFlagName | MetroFlags;

	if (!flagName) {
		return res.status(400).json({
			message: `Flag name is required, please provide a flag name as a query parameter like so: /scrape?flag=flag_name`,
			availableOptions: [
				...Object.values(LoblawsFlagName),
				...Object.values(MetroFlags),
			],
		});
	}

	if (Object.values(LoblawsFlagName).includes(flagName as LoblawsFlagName)) {
		const response = await scrapeLoblaws(flagName as LoblawsFlagName);

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

	if (Object.values(MetroFlags).includes(flagName as MetroFlags)) {
		const response = await scrapeMetro(flagName as MetroFlags);
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
		message: `Invalid flag name, please provide a valid flag name as a query parameter like so: /scrape?flag=flag_name`,
		availableOptions: [...Object.values(AllParentCompanyList)],
	});
};

export default scrapeStores;
