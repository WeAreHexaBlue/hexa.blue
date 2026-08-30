import { getLocale } from "$lib/paraglide/runtime";

export async function load({ platform }) {
    const locale = getLocale();

    const { results }: { results: App.Article[] } = await platform!.env.DB
        .prepare(`SELECT slug, title, author, short, created_at FROM articles WHERE locale = ?`)
        .bind(locale)
        .all();
    
    return { articles: results }; 
}