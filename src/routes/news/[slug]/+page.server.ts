import { error } from "@sveltejs/kit";
import { getLocale, baseLocale } from "$lib/paraglide/runtime";

export async function load({ params, platform }) {
    const locale = getLocale();

    let article: App.Article | null = await platform!.env.DB
        .prepare("SELECT * FROM articles WHERE slug = ? AND locale = ?")
        .bind(params.slug, locale)
        .first();

    let usedBase = false;
    if (!article && locale != baseLocale) {
        article = await platform!.env.DB
            .prepare("SELECT * FROM articles WHERE slug = ? AND locale = ?")
            .bind(params.slug, baseLocale)
            .first();
        usedBase = true;
    }

    if (!article) throw error(404, `Post \`${params.slug}\` not found.`);

    return { article, usedBase };
}