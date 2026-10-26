import { error, redirect } from "@sveltejs/kit";
import { getLocale, baseLocale, localizeHref, type Locale } from "$lib/paraglide/runtime";
import { parseTags } from "$lib";

export async function load({ params, platform }) {
    const locale = getLocale();

    const { results }: { results: App.Article[] } = await platform!.env.DB
        .prepare("SELECT * FROM articles WHERE slug = ?")
        .bind(params.slug)
        .all();

    const article =
        results.find((entry) => entry.locale === locale) ??
        results.find((entry) => entry.locale === baseLocale);

    if (!article) throw error(404, `Post \`${params.slug}\` not found.`);

    // An article without a translation must not exist at a second URL.
    // Send readers and crawlers to the single canonical copy instead.
    if (article.locale !== locale) {
        redirect(307, localizeHref(`/news/${params.slug}`, { locale: article.locale as Locale }));
    }

    return {
        article: {
            ...article,
            tags: parseTags(article.tags)
        },
        seo: {
            languages: results.map((entry) => entry.locale)
        }
    };
}