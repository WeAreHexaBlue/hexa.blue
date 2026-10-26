import { json, error } from "@sveltejs/kit";

function checkAuth(request: Request, platform: App.Platform | undefined) {
    if (!platform?.env?.DB) throw error(500, "Database not ready.");

    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${platform.env.PUBLISHER_TOKEN}`) {
        throw error(401, "Missing authorized publisher token.");
    }
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const tagPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const localePattern = /^[A-Za-z0-9_-]+$/;

const MAX_TAGS = 12;
const MAX_TAG_LENGTH = 32;

const MAX_IMAGES = 24;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_TOTAL_IMAGE_BYTES = 32 * 1024 * 1024;
const IMAGE_NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 ._-]{0,127}$/;

type IncomingImage = {
    name: string;
    data: string;
};

type PreparedImage = {
    name: string;
    key: string;
    url: string;
    mime: string;
    bytes: Uint8Array;
};

function normalizeTags(value: unknown): string[] | null {
    if (value === undefined || value === null) return null;
    if (!Array.isArray(value))
        throw error(400, "`tags` must be an array of strings.");

    const tags = [
        ...new Set(
            value
                .map((tag) => {
                    if (typeof tag !== "string")
                        throw error(400, "`tags` must be an array of strings.");

                    return tag.trim().toLowerCase().replace(/[\s_]+/g, "-");
                })
                .filter((tag) => tag.length > 0)
        )
    ];

    if (tags.length > MAX_TAGS)
        throw error(400, `An article can have at most ${MAX_TAGS} tags.`);

    for (const tag of tags) {
        if (tag.length > MAX_TAG_LENGTH || !tagPattern.test(tag))
            throw error(
                400,
                `Invalid tag \`${tag}\`. Tags must be lowercase letters, numbers, and hyphens only.`
            );
    }

    return tags;
}

function decodeBase64(value: string): Uint8Array {
    const data = value
        .replace(/\s+/g, "")
        .replace(/^data:[^;]*;base64,/i, "");

    if (!data || data.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(data))
        throw error(400, "Image data must be valid base64.");

    let binary: string;
    try {
        binary = atob(data);
    } catch {
        throw error(400, "Image data must be valid base64.");
    }

    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    return bytes;
}

function ascii(bytes: Uint8Array, start: number, end: number): string {
    let value = "";
    for (let i = start; i < end; i++) value += String.fromCharCode(bytes[i]);

    return value;
}

function sniffImage(bytes: Uint8Array): { mime: string; ext: string } | null {
    if (
        bytes.length >= 8 &&
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47 &&
        bytes[4] === 0x0d &&
        bytes[5] === 0x0a &&
        bytes[6] === 0x1a &&
        bytes[7] === 0x0a
    )
        return { mime: "image/png", ext: "png" };

    if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
        return { mime: "image/jpeg", ext: "jpg" };

    if (bytes.length >= 6) {
        const header = ascii(bytes, 0, 6);
        if (header === "GIF87a" || header === "GIF89a")
            return { mime: "image/gif", ext: "gif" };
    }

    if (
        bytes.length >= 12 &&
        ascii(bytes, 0, 4) === "RIFF" &&
        ascii(bytes, 8, 12) === "WEBP"
    )
        return { mime: "image/webp", ext: "webp" };

    if (bytes.length >= 12 && ascii(bytes, 4, 8) === "ftyp") {
        const brand = ascii(bytes, 8, 12);
        if (brand === "avif" || brand === "avis")
            return { mime: "image/avif", ext: "avif" };
    }

    return null;
}

async function imageKey(
    slug: string,
    name: string,
    extension: string,
    bytes: Uint8Array
): Promise<string> {
    const base =
        name
            .replace(/\.[^.]+$/, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 48) || "image";

    const digest = await crypto.subtle.digest("SHA-256", new Uint8Array(bytes).buffer);
    const hash = Array.from(new Uint8Array(digest))
        .slice(0, 4)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

    return `articles/${slug}/${base}-${hash}.${extension}`;
}

async function prepareImages(
    value: unknown,
    slug: string
): Promise<PreparedImage[] | undefined> {
    if (value === undefined || value === null) return undefined;
    if (!Array.isArray(value)) throw error(400, "`images` must be an array.");

    if (value.length > MAX_IMAGES)
        throw error(400, `An article can have at most ${MAX_IMAGES} images.`);

    const names = new Set<string>();
    const images: PreparedImage[] = [];
    let totalBytes = 0;

    for (const item of value) {
        if (!item || typeof item !== "object")
            throw error(400, "Each image must be an object with `name` and `data`.");

        const { name, data } = item as Partial<IncomingImage>;

        if (
            typeof name !== "string" ||
            !IMAGE_NAME_PATTERN.test(name) ||
            name === "." ||
            name === ".."
        )
            throw error(
                400,
                "Each image needs a valid `name` (letters, numbers, spaces, dots, underscores, and hyphens)."
            );

        if (names.has(name)) throw error(400, `Duplicate image \`${name}\`.`);
        names.add(name);

        if (typeof data !== "string")
            throw error(400, `Image \`${name}\` needs base64 \`data\`.`);

        const bytes = decodeBase64(data);

        if (bytes.length > MAX_IMAGE_BYTES)
            throw error(400, `Image \`${name}\` is larger than 8 MB.`);

        totalBytes += bytes.length;
        if (totalBytes > MAX_TOTAL_IMAGE_BYTES)
            throw error(400, "Images can total at most 32 MB per article.");

        const sniffed = sniffImage(bytes);
        if (!sniffed)
            throw error(
                400,
                `Image \`${name}\` must be a PNG, JPEG, GIF, WebP, or AVIF file.`
            );

        const key = await imageKey(slug, name, sniffed.ext, bytes);

        images.push({
            name,
            key,
            url: `/media/${key}`,
            mime: sniffed.mime,
            bytes
        });
    }

    return images;
}

function imageReferences(html: string): string[] {
    const pattern = /<img\b[^>]*?\ssrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/gi;
    const references: string[] = [];

    for (const match of html.matchAll(pattern)) {
        const src = (match[1] ?? match[2] ?? match[3] ?? "").trim();
        const reference = /^(?:\.\/)?images\/([^/\\?#]+)/i.exec(src);

        if (reference) references.push(reference[1]);
    }

    return references;
}

function rewriteImageReferences(html: string, urls: Map<string, string>): string {
    return html.replace(
        /(\ssrc\s*=\s*)(["'])((?:\.\/)?images\/[^"']+)\2/gi,
        (match, prefix: string, quote: string, src: string) => {
            const reference = /^(?:\.\/)?images\/([^/\\?#]+)/i.exec(src);
            if (!reference) return match;

            const name = reference[1];
            const url = urls.get(name) ?? urls.get(decodeURIComponentSafe(name));

            return url ? `${prefix}${quote}${url}${quote}` : match;
        }
    );
}

function decodeURIComponentSafe(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

async function uploadImages(bucket: R2Bucket, images: PreparedImage[]): Promise<void> {
    await Promise.all(
        images.map((image) =>
            bucket.put(image.key, image.bytes, {
                httpMetadata: {
                    contentType: image.mime,
                    cacheControl: "public, max-age=31536000, immutable"
                }
            })
        )
    );
}

async function deleteUnreferencedImages(
    bucket: R2Bucket,
    slug: string,
    keep: Set<string>
): Promise<void> {
    const prefix = `articles/${slug}/`;
    let cursor: string | undefined;

    do {
        const options: R2ListOptions = { prefix, limit: 1000 };
        if (cursor) options.cursor = cursor;

        const listed = await bucket.list(options);
        const stale = listed.objects
            .map((object) => object.key)
            .filter((key) => !keep.has(key));

        if (stale.length > 0) await bucket.delete(stale);

        cursor = listed.truncated ? listed.cursor : undefined;
    } while (cursor);
}

function imageKeysIn(html: string, slug: string): Set<string> {
    const keys = new Set<string>();
    const pattern = /\/media\/(articles\/[A-Za-z0-9_./-]+)/g;
    const prefix = `articles/${slug}/`;

    for (const match of html.matchAll(pattern)) {
        const key = decodeURIComponentSafe(match[1]);
        if (key.startsWith(prefix)) keys.add(key);
    }

    return keys;
}

function keepImagesFor(
    slug: string,
    rows: { body: string; short: string | null }[]
): Set<string> {
    const keep = new Set<string>();

    for (const row of rows) {
        for (const key of imageKeysIn(row.body, slug)) keep.add(key);
        if (row.short) {
            for (const key of imageKeysIn(row.short, slug)) keep.add(key);
        }
    }

    return keep;
}

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
    if (!localePattern.test(locale))
        throw error(400, "Locale must be letters, numbers, underscores, or hyphens only.");

    const title = rbody.title?.trim() || null;
    const author = rbody.author?.trim() || null;
    const body = rbody.body?.trim() || null;
    const short = rbody.short?.trim() || null;
    const tags = normalizeTags(rbody.tags);
    const images = await prepareImages(rbody.images, slug);

    const imageUrls = new Map(images?.map((image) => [image.name, image.url]));

    for (const name of [
        ...imageReferences(body ?? ""),
        ...imageReferences(short ?? "")
    ]) {
        if (!imageUrls.has(name) && !imageUrls.has(decodeURIComponentSafe(name)))
            throw error(
                400,
                `Article references \`images/${name}\`, but that image was not uploaded.`
            );
    }

    const bucket = platform!.env.IMAGES;
    if (images && images.length > 0 && !bucket)
        throw error(500, "Image storage not ready.");

    const db = platform!.env.DB;
    const existing = await db
        .prepare("SELECT id FROM articles WHERE slug = ? AND locale = ?")
        .bind(slug, locale)
        .first<{ id: number }>();

    if (!existing && (!title || !author || !body))
        throw error(400, "Creating a new article requires `title`, `author`, and `body`.");

    const finalBody = body ? rewriteImageReferences(body, imageUrls) : null;
    const finalShort = short ? rewriteImageReferences(short, imageUrls) : null;

    if (images && images.length > 0)
        await uploadImages(bucket!, images);

    const binds = [
        slug,
        locale,
        title,
        author,
        finalBody,
        finalShort,
        tags ? JSON.stringify(tags) : null
    ];

    if (existing) {
        await db
            .prepare(
                `
                UPDATE articles
                SET
                    title  = COALESCE(?3, title),
                    author = COALESCE(?4, author),
                    body   = COALESCE(?5, body),
                    short  = COALESCE(?6, short),
                    tags   = COALESCE(?7, tags)
                WHERE slug = ?1 AND locale = ?2
                `
            )
            .bind(...binds)
            .run();
    } else {
        try {
            await db
                .prepare(
                    `
                    INSERT INTO articles (slug, locale, title, author, body, short, tags, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, COALESCE(?, '[]'), datetime('now'))
                    `
                )
                .bind(...binds)
                .run();
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);

            if (message.includes("UNIQUE constraint failed"))
                throw error(409, "An article with that slug and locale already exists.");

            console.error("D1 insert failed:", message);
            throw error(500, "Failed to save article.");
        }
    }

    if (bucket && finalBody !== null) {
        try {
            const rows = await db
                .prepare("SELECT body, short FROM articles WHERE slug = ?")
                .bind(slug)
                .all<{ body: string; short: string | null }>();

            const keep = keepImagesFor(slug, rows.results);
            await deleteUnreferencedImages(bucket, slug, keep);
        } catch (e) {
            console.error("Failed to clean up old article images:", e);
        }
    }

    return json({
        ok: true,
        created: !existing,
        slug,
        locale,
        images: Object.fromEntries(imageUrls)
    });
}

export async function DELETE({ request, platform, url }) {
    checkAuth(request, platform);

    const slug = url.searchParams.get("slug");
    const locale = url.searchParams.get("locale");
    if (!slug || !locale)
        throw error(400, "You need to specify `slug` and `locale` in the URL.");

    const db = platform!.env.DB;
    const result = await db
        .prepare(`DELETE FROM articles WHERE slug = ? AND locale = ?`)
        .bind(slug, locale)
        .run();

    if (result.meta.changes === 0) {
        throw error(404, "No article found for that slug and locale.");
    }

    const bucket = platform!.env.IMAGES;
    if (bucket) {
        try {
            const rows = await db
                .prepare("SELECT body, short FROM articles WHERE slug = ?")
                .bind(slug)
                .all<{ body: string; short: string | null }>();

            const keep = keepImagesFor(slug, rows.results);
            await deleteUnreferencedImages(bucket, slug, keep);
        } catch (e) {
            console.error("Failed to delete article images:", e);
        }
    }

    return json({ ok: true, slug, locale });
}