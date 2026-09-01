import { json, error } from "@sveltejs/kit";

function checkAuth(request: Request, platform: App.Platform | undefined) {
    if (!platform?.env?.DB) throw error(500, "Database not ready.");

    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${platform.env.PUBLISHER_TOKEN}`) {
        throw error(401, "Missing authorized publisher token.");
    }
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function PUT({ request, platform, url }) {
    checkAuth(request, platform);

    const rbody = await request.json().catch(() => ({})) as NewsPubPUT;
    const slug = rbody.slug ?? url.searchParams.get("slug");
    const locale = rbody.locale ?? url.searchParams.get("locale");

    if (!slug || typeof slug !== "string" || !slug.trim())
        throw error(400, "Missing or invalid `slug`.");
    if (!locale || typeof locale !== "string" || !locale.trim())
        throw error(400, "Missing or invalid `locale`.");

    if (!slugPattern.test(slug))
        throw error(400, "Slug must be lowercase letters, numbers, and hyphens only.");

    const title = rbody.title?.trim() || null;
    const author = rbody.author?.trim() || null;
    const body = rbody.body?.trim() || null;
    const short = rbody.short?.trim() || null;

    const binds = [ slug, locale, title, author, body, short ];

    const update = await platform!.env.DB
        .prepare(
            `
            UPDATE articles
            SET
                title  = COALESCE(?3, title),
                author = COALESCE(?4, author),
                body   = COALESCE(?5, body),
                short  = COALESCE(?6, short)
            WHERE slug = ?1 AND locale = ?2
            `
        )
        .bind(...binds)
        .run();
    
    if (update.meta.changes > 0)
        return json({ ok: true, created: false, slug, locale });

    if (!title || !author || !body)
        throw error(400, "Creating a new article requires `title`, `author`, and `body`.");

    try {
        await platform!.env.DB
            .prepare(
                `
                INSERT INTO articles (slug, locale, title, author, body, short, created_at)
                VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
                `
            )
            .bind(...binds)
            .run()
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);

        if (message.includes("NOT NULL constraint failed"))
            throw error(400, "Creating a new article requires `title`, `author`, and `body`.");

		console.error("D1 insert failed:", message);
		throw error(500, "Failed to save article.");
    }

    return json({ ok: true, created: true, slug, locale })
}

export async function DELETE({ request, platform, url }) {
    checkAuth(request, platform);

    const slug = url.searchParams.get("slug");
    const locale = url.searchParams.get("locale");
    if (!slug || !locale)
        throw error(400, "You need to specify `slug` and `locale` in the URL.");

    const result = await platform!.env.DB
        .prepare(`DELETE FROM articles WHERE slug = ? AND locale = ?`)
        .bind(slug, locale)
        .run();

    if (result.meta.changes === 0) {
        throw error(404, "No article found for that slug and locale.");
    }

    return json({ ok: true, slug, locale });
};