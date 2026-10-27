import { getLocale } from "$lib/paraglide/runtime";
import { m } from "$lib/paraglide/messages";
import { htmlToText } from "$lib/html";
import { escapeXml, localizedPath, toIsoDate } from "$lib/seo";
import type { RequestEvent } from "./$types";

const MAX_ITEMS = 50;
const MAX_DESCRIPTION = 500;

type FeedArticle = {
    slug: string;
    title: string;
    short: string | null;
    body: string;
    created_at: string;
};

function plainText(value: string) {
    const text = htmlToText(value);

    return text.length > MAX_DESCRIPTION
        ? `${text.slice(0, MAX_DESCRIPTION - 1).trimEnd()}…`
        : text;
}

export async function GET({ platform, url }: RequestEvent) {
    const locale = getLocale();

    const { results } = await platform!.env.DB.prepare(
        `SELECT slug, title, short, body, created_at
             FROM articles
             WHERE locale = ?
             ORDER BY created_at DESC
             LIMIT ?`
    )
        .bind(locale, MAX_ITEMS)
        .all<FeedArticle>();

    const feedUrl = (path: string) => new URL(localizedPath(path, locale), url.origin).href;

    const items = results.map((article) => {
        const link = escapeXml(feedUrl(`/news/${article.slug}`));
        const date = toIsoDate(article.created_at);

        return `        <item>
            <title>${escapeXml(article.title)}</title>
            <link>${link}</link>
            <guid isPermaLink="true">${link}</guid>${
                date ? `\n            <pubDate>${new Date(date).toUTCString()}</pubDate>` : ""
            }
            <description>${escapeXml(plainText(article.short ?? article.body))}</description>
        </item>`;
    });

    const lastBuildDate = toIsoDate(results[0]?.created_at ?? "");

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>${escapeXml(m["news.feed.title"]())}</title>
        <link>${escapeXml(feedUrl("/news"))}</link>
        <description>${escapeXml(m["news.feed.description"]())}</description>
        <language>${locale}</language>
        <lastBuildDate>${lastBuildDate ? new Date(lastBuildDate).toUTCString() : new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${escapeXml(feedUrl("/news/rss.xml"))}" rel="self" type="application/rss+xml" />
${items.join("\n")}
    </channel>
</rss>
`;

    return new Response(body, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600"
        }
    });
}
