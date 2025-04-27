import { startCrawlingService } from "../services/crawler.service.js";
import { getClientByGuid } from "../utilities/webSockets.utilities.js";
import { accepted, badRequest } from "../utilities/response.utilities.js";

export async function startCrawlingController(req, res) {
    const { targetUrl, searchText, maxDepth, maxPages, guid } = req.body;

    const client = getClientByGuid(guid);
    if (!client) {
        return badRequest(res, "Websocket client not found");
    }
    accepted(res, "Crawling started");
    await startCrawlingService({ targetUrl, searchText, maxDepth, maxPages, client });
}