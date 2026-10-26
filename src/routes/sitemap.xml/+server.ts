import type { RequestHandler } from "./$types";
import { baseLocale, locales, localizeHref, type Locale } from "$lib/paraglide/runtime";

/** Routes that exist for every locale. */
const STATIC_PATHS = ["/", "/projects", "/news", "/members", "/contact"];

type ArticleRow = {
    slug: string;
    locale: string;
    created_at: string;
};

type Alternate = {
    hreflang: string;
    href: string;
};

type Entry = {
    loc: string;
    lastmod?: string;
    alternates: Alternate[];
};

function escapeXml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

/** SQLite timestamps ("2026-10-25 20:31:53") are stored as UTC. */
function toIso(value: string) {
    if (value.includes("T")) return value;
    return `${value.replace(" ", "T")}Z`;
}

export const GET: RequestHandler = async ({ platform, url }) => {
    const origin = url.origin;
    const absolute = (href: string) => `${origin}${href}`;

    let articles: ArticleRow[] = [];
    try {
        const { results } = await platform!.env.DB.prepare(
            "SELECT slug, locale, created_at FROM articles ORDER BY created_at DESC"
        ).all<ArticleRow>();
        articles = results;
    } catch {
        // The static routes are still worth serving if the database is down.
    }

    const entries: Entry[] = [];

    for (const path of STATIC_PATHS) {
        const alternates = locales.map((locale) => ({
            hreflang: locale,
            href: absolute(localizeHref(path, { locale }))
        }));

        for (const alternate of alternates) {
            entries.push({
                loc: alternate.href,
                // Self-referencing hreflang entries are expected by Google.
                alternates: [
                    ...alternates,
                    {
                        hreflang: "x-default",
                        href: absolute(localizeHref(path, { locale: baseLocale }))
                    }
                ]
            });
        }
    }

    const bySlug = new Map<string, ArticleRow[]>();
    for (const article of articles) {
        const group = bySlug.get(article.slug) ?? [];
        group.push(article);
        bySlug.set(article.slug, group);
    }

    for (const [slug, group] of bySlug) {
        const alternates = group.map((article) => ({
            hreflang: article.locale,
            href: absolute(localizeHref(`/news/${slug}`, { locale: article.locale as Locale }))
        }));

        const defaultHref =
            alternates.find((alternate) => alternate.hreflang === baseLocale)?.href ??
            alternates[0].href;

        for (const article of group) {
            const href = absolute(
                localizeHref(`/news/${slug}`, { locale: article.locale as Locale })
            );

            entries.push({
                loc: href,
                lastmod: toIso(article.created_at),
                alternates: [...alternates, { hreflang: "x-default", href: defaultHref }]
            });
        }
    }

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
    .map(
        (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>${
        entry.lastmod ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : ""
    }
${entry.alternates
    .map(
        (alternate) =>
            `    <xhtml:link rel="alternate" hreflang="${escapeXml(alternate.hreflang)}" href="${escapeXml(alternate.href)}" />`
    )
    .join("\n")}
  </url>`
    )
    .join("\n")}
</urlset>
`;

    return new Response(body, {
        headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600"
        }
    });
};
