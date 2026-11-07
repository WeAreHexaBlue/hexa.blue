import { error } from "@sveltejs/kit";
import { getLocale, baseLocale, locales } from "$lib/paraglide/runtime";
import { parseTags } from "$lib";
import { POLL_VOTER_COOKIE } from "$lib/polls";
import { getArticlePolls } from "$lib/server/polls";

export async function load({ params, platform, cookies }) {
    const locale = getLocale();

    let article: App.Article | null = await platform!.env.DB.prepare(
        "SELECT * FROM articles WHERE slug = ? AND locale = ?"
    )
        .bind(params.slug, locale)
        .first();

    let usedBase = false;
    if (!article && locale != baseLocale) {
        article = await platform!.env.DB.prepare(
            "SELECT * FROM articles WHERE slug = ? AND locale = ?"
        )
            .bind(params.slug, baseLocale)
            .first();
        usedBase = true;
    }

    if (!article) throw error(404, `Post \`${params.slug}\` not found.`);

    const { results: translations } = await platform!.env.DB.prepare(
        "SELECT DISTINCT locale FROM articles WHERE slug = ?"
    )
        .bind(params.slug)
        .all<{ locale: string }>();

    const polls = await getArticlePolls(
        platform!.env.DB,
        article.id,
        cookies.get(POLL_VOTER_COOKIE) ?? ""
    );

    return {
        article: {
            ...article,
            tags: parseTags(article.tags)
        },
        polls,
        usedBase,
        locales: translations
            .map((translation) => translation.locale)
            .filter((translation) => (locales as readonly string[]).includes(translation))
    };
}
