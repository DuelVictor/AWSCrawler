import { startCrawlingService } from "../services/crawler.service.js";
import { getClientByGuid } from "../utilities/webSockets.utilities.js";
import { accepted, badRequest } from "../utilities/response.utilities.js";
import { startCrawlingService2 } from "../services/crawler.service2.js";

export async function startCrawlingController(req, res) {
    const { targetUrl, searchText, maxDepth, maxPages, clientGuid } = req.body;

    const client = getClientByGuid(clientGuid);
    if (!client) {
        return badRequest(res, "Websocket client not found");
    }
    accepted(res, "Crawling started");
    await startCrawlingService({ targetUrl, searchText, maxDepth, maxPages, client });
}

export async function startCrawlingController2(req, res) {
    const { targetUrl, searchText, maxDepth, maxPages, clientGuid } = req.body;

    const client = getClientByGuid(clientGuid);
    if (!client) {
        return badRequest(res, "Websocket client not found");
    }
    accepted(res, "Crawling started");
    await startCrawlingService2({ targetUrl, searchText, maxDepth, maxPages, clientGuid });
}

export async function receiveReportFromWorker(req, res) {
    const { clientGuid, targetUrl, currentDepth, pagesCrawled, nextDepthLinks } = req.body;

    const client = getClientByGuid(clientGuid);
    if(!client) {
        return badRequest(res, "Websocket client not found");
    }
    client.send(JSON.stringify({ targetUrl, currentDepth, pagesCrawled, nextDepthLinks }));
}