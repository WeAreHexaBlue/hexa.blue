import { getLocale } from "$lib/paraglide/runtime";
import { parseTags } from "$lib";
import { htmlToText } from "$lib/html";

export async function load({ platform, url }) {
    const locale = getLocale();
    const query = (url.searchParams.get("q") ?? "").trim();

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

    return {
        query,
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
