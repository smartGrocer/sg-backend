import * as cheerio from "cheerio";

const removeHtmlTags = (html: string): string => {
	if (!html || html === "") {
		return "";
	}
	const $ = cheerio.load(html);
	return $.text() || "N/A";
};

export default removeHtmlTags;
