import sanitize from "sanitize-html";

export const articleSanitizeOptions: sanitize.IOptions = {
    allowedTags: [
        "b",
        "i",
        "u",
        "em",
        "strong",
        "a",
        "br",
        "code",
        "p",
        "img",
        "figure",
        "figcaption"
    ],
    allowedAttributes: {
        a: ["href", "class"],
        img: ["src", "alt", "title", "width", "height", "loading", "decoding", "class"]
    },
    allowedSchemesByTag: {
        img: ["http", "https"]
    },
    transformTags: {
        img: (tagName, attribs) => ({
            tagName,
            attribs: {
                ...attribs,
                alt: attribs.alt ?? "",
                loading: attribs.loading ?? "lazy",
                decoding: "async"
            }
        })
    }
};

export function htmlToText(html: string): string {
    const spaced = html
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<\/(p|div|li|h[1-6]|blockquote)>/gi, " ");

    return sanitize(spaced, { allowedTags: [], allowedAttributes: {} })
        .replace(/&nbsp;/g, " ")
        .replace(/&#x([0-9a-f]+);/gi, (_match, code: string) =>
            String.fromCodePoint(parseInt(code, 16))
        )
        .replace(/&#(\d+);/g, (_match, code: string) => String.fromCodePoint(Number(code)))
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim();
}

function decodeEntities(value: string): string {
    return value
        .replace(/&#x([0-9a-f]+);/gi, (_match, code: string) =>
            String.fromCodePoint(parseInt(code, 16))
        )
        .replace(/&#(\d+);/g, (_match, code: string) => String.fromCodePoint(Number(code)))
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&");
}

export function firstImage(html: string): { src: string; alt: string } | null {
    const tag = /<img\b[^>]*>/i.exec(html)?.[0];
    if (!tag) return null;

    const attribute = (name: string) => {
        const match = new RegExp(
            `(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+))`,
            "i"
        ).exec(tag);

        return match ? decodeEntities(match[1] ?? match[2] ?? match[3] ?? "") : "";
    };

    const src = attribute("src").trim();
    if (!src || /^(?:data|javascript|vbscript):/i.test(src)) return null;

    return { src, alt: attribute("alt") };
}
