import { getLocale } from "$lib/paraglide/runtime";
import { parseTags } from "$lib";
import { htmlToText } from "$lib/html";
import { POLL_VOTER_COOKIE } from "$lib/polls";
import { getLocalePolls } from "$lib/server/polls";

export async function load({ platform, url, cookies }) {
    const locale = getLocale();
    const query = (url.searchParams.get("q") ?? "").trim();
    const tab = url.searchParams.get("tab") === "polls" ? "polls" : "articles";

    const { results }: { results: App.Article[] } = await platform!.env.DB.prepare(
        `
            SELECT slug, title, author, short, body, tags, created_at
            FROM articles
            WHERE locale = ?
            ORDER BY created_at DESC
            `
    )
        .bind(locale)
        .all();

    const articles = results.map((article) => ({
        ...article,
        tags: parseTags(article.tags)
    }));

    const terms = query
        .toLowerCase()
        .split(/\s+/)
        .map((term) => term.replace(/^#+/, ""))
        .filter(Boolean);

    const polls = await getLocalePolls(
        platform!.env.DB,
        locale,
        cookies.get(POLL_VOTER_COOKIE) ?? ""
    );

    return {
        query,
        tab,
        polls,
        articles: articles
            .filter((article) => {
                if (terms.length === 0) return true;

                const haystack = [
                    article.title,
                    ...article.tags,
                    htmlToText(article.short ?? ""),
                    htmlToText(article.body)
                ]
                    .join(" ")
                    .toLowerCase();

                return terms.every((term) => haystack.includes(term));
            })
            .map(({ body, ...article }) => ({
                ...article,
                body: article.short ? "" : body
            }))
    };
}
