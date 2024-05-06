import * as cheerio from "cheerio";

const removeHtmlTags = (html: string): string => {
	if (!html || html === "") {
		return "";
	}
	const $ = cheerio.load(html);
	return $.text();
};

export default removeHtmlTags;
