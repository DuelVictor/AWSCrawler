import * as cheerio from "cheerio";

export async function startCrawlingService({ targetUrl, searchText, maxDepth, maxPages, client }) {
    let currentDepthLinks = [targetUrl];
    const state = { currentDepth: 0, currentPage: 0 };
    client.send(JSON.stringify({ status: "started" }));
    while (state.currentDepth <= maxDepth) {
        currentDepthLinks = await crawlingLoop(maxPages, searchText, currentDepthLinks, client, state);
    }
    client.send(JSON.stringify({ status: "done" }));
}

async function fetchHTML(url) {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('text/html')) {
        return await response.text();
    } else {
        console.warn(`Skipping ${url}: not HTML (type is ${contentType})`);
    }
}

async function crawlingLoop(maxPages, searchText, currentDepthLinks, client, state) {
    const nextDepthLinks = [];
    for (; state.currentPage < maxPages && currentDepthLinks.length > 0; state.currentPage++) {
        const targetUrl = currentDepthLinks.pop();
        const html = await fetchHTML(targetUrl);
        if (!html) continue;
        const $ = cheerio.load(html);
        const title = $('title').text().trim();
        $('a[href]').each((_, element) => {
            const href = $(element).attr('href');
            if (!href) return;
            try {
                const absoluteUrl = new URL(href, targetUrl).toString();
                if (!absoluteUrl.startsWith('http://') && !absoluteUrl.startsWith('https://')) return;
                nextDepthLinks.push(absoluteUrl);
            } catch (err) {
                console.warn(`Skipping invalid link: ${href} from ${targetUrl}`);
            }
        });
        const response = {
            title,
            depth: state.currentDepth,
            url: targetUrl,
            links: nextDepthLinks
        }
        client.send(JSON.stringify(response));
    }
    state.currentDepth++;
    return nextDepthLinks;
}