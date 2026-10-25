import { getLocale } from "$lib/paraglide/runtime";
import { parseTags } from "$lib";

export async function load({ platform }) {
    const locale = getLocale();

    const { results }: { results: App.Article[] } = await platform!.env.DB
        .prepare(
            `
            SELECT slug, title, author, short, tags, created_at
            FROM articles
            WHERE locale = ?
            ORDER BY created_at DESC
            `
        )
        .bind(locale)
        .all();
    
    return {
        articles: results.map((article) => ({
            ...article,
            tags: parseTags(article.tags)
        }))
    };
}