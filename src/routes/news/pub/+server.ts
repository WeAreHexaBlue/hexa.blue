import { json, error } from "@sveltejs/kit";

export async function POST({ request, platform }) {
    if (!platform?.env?.DB) throw error(500, "Database not ready.");

    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${platform.env.PUBLISHER_TOKEN}`)
        throw error(401, "Missing authorized publisher token.")

    const { slug, locale, title, author, body, short }: NewsPubPOST = await request.json();

    const missing: string[] = [];
	if (typeof slug !== "string" || !slug.trim()) missing.push("slug");
	if (typeof locale !== "string" || !locale.trim()) missing.push("locale");
	if (typeof title !== "string" || !title.trim()) missing.push("title");
	if (typeof body !== "string" || !body.trim()) missing.push("body");

	if (missing.length) {
		throw error(400, `Missing or invalid fields: ${missing.join(", ")}.`);
	}

	const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
	if (!slugPattern.test(slug as string)) {
		throw error(400, "Slug must be lowercase letters, numbers, and hyphens only.");
	}

    try {
        await platform!.env.DB
            .prepare(
                `
                INSERT INTO articles (slug, locale, title, author, body, short, created_at)
                VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
                `
            )
            .bind(slug, locale, title, author ?? "Flamey", body, short ?? null)
            .run()
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);

		if (message.includes("UNIQUE constraint failed")) {
			throw error(409, "An article with this slug already exists for this locale.");
		}

		console.error("D1 insert failed:", message);
		throw error(500, "Failed to save article.");
    }

    return json({ ok: true, slug })
}