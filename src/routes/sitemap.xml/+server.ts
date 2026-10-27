import { baseLocale, locales } from "$lib/paraglide/runtime";
import type { RequestEvent } from "./$types";

const STATIC_PATHS = ["/", "/projects", "/news", "/members", "/contact"];

type Entry = {
    path: string;
    lastmod?: string;
};

type SitemapArticle = {
    slug: string;
    locale: string;
    created_at: string;
};

function localizedPath(path: string, locale: string): string {
    const prefix = locale === baseLocale ? "" : `/${locale}`;
    const suffix = path === "/" ? "" : path;
    const localized = `${prefix}${suffix}`;

    return localized === "" ? "/" : localized;
}

function toLastmod(value: string): string | undefined {
    const iso = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
    const date = new Date(iso);

    return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function escapeXml(value: string): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");
}

export async function GET({ platform, url }: RequestEvent) {
    const entries: Entry[] = STATIC_PATHS.flatMap((path) =>
        locales.map((locale) => ({ path: localizedPath(path, locale) }))
    );

    const db = platform?.env?.DB;

    if (db) {
        const { results } = await db
            .prepare("SELECT slug, locale, created_at FROM articles ORDER BY created_at DESC")
            .all<SitemapArticle>();

        for (const article of results) {
            if (!(locales as readonly string[]).includes(article.locale)) continue;

            entries.push({
                path: localizedPath(`/news/${article.slug}`, article.locale),
                lastmod: toLastmod(article.created_at)
            });
        }
    }

    const urls = entries.map(({ path, lastmod }) => {
        const loc = escapeXml(new URL(path, url.origin).href);
        const lastmodTag = lastmod ? `\n        <lastmod>${lastmod}</lastmod>` : "";

        return `    <url>\n        <loc>${loc}</loc>${lastmodTag}\n    </url>`;
    });

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

    return new Response(body, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600"
        }
    });
}
