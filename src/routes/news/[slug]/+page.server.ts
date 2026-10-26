import { error, redirect } from "@sveltejs/kit";
import { getLocale, baseLocale, localizeHref } from "$lib/paraglide/runtime";
import { parseTags } from "$lib";

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

    // An article without a translation must not exist at a second URL.
    // Send readers and crawlers to the single canonical copy instead.
    if (usedBase) {
        redirect(307, localizeHref(`/news/${params.slug}`, { locale: baseLocale }));
    }

    return {
        article: {
            ...article,
            tags: parseTags(article.tags)
        },
        usedBase
    };
}