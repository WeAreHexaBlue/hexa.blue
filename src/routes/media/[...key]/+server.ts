import { error } from "@sveltejs/kit";
import type { RequestEvent, RequestHandler } from "./$types";

const keyPattern = /^articles\/[a-z0-9-]+\/(?:[A-Za-z0-9_-]+\/)?[a-z0-9-]+\.[a-z0-9]+$/;

const mimeTypes: Record<string, string> = {
    avif: "image/avif",
    gif: "image/gif",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    webp: "image/webp"
};

function contentType(key: string): string {
    const extension = key.slice(key.lastIndexOf(".") + 1).toLowerCase();
    return mimeTypes[extension] ?? "application/octet-stream";
}

async function serve({ params, platform, request }: RequestEvent) {
    const key = params.key;

    if (!key || !keyPattern.test(key)) throw error(404, "Image not found.");

    const bucket = platform?.env?.IMAGES;
    if (!bucket) throw error(500, "Image storage not ready.");

    const object = await bucket.get(key);
    if (!object) throw error(404, "Image not found.");

    const headers = new Headers();
    const metadata = object.httpMetadata;

    headers.set("content-type", metadata?.contentType ?? contentType(key));
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", "public, max-age=31536000, immutable");
    headers.set("content-length", String(object.size));
    headers.set("x-content-type-options", "nosniff");

    if (metadata?.contentLanguage) headers.set("content-language", metadata.contentLanguage);
    if (metadata?.contentDisposition)
        headers.set("content-disposition", metadata.contentDisposition);
    if (metadata?.contentEncoding) headers.set("content-encoding", metadata.contentEncoding);

    const ifNoneMatch = request.headers.get("if-none-match");
    if (ifNoneMatch && (ifNoneMatch === "*" || ifNoneMatch.includes(object.httpEtag))) {
        return new Response(null, { status: 304, headers });
    }

    return new Response(object.body, { headers });
}

export const GET: RequestHandler = serve;

export const HEAD: RequestHandler = async (event) => {
    const response = await serve(event);
    return new Response(null, {
        status: response.status,
        headers: response.headers
    });
};
