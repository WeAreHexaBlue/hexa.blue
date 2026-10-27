import { baseLocale } from "$lib/paraglide/runtime";

export function localizedPath(path: string, locale: string) {
    const prefix = locale === baseLocale ? "" : `/${locale}`;
    const suffix = path === "/" ? "" : path;

    return `${prefix}${suffix}` || "/";
}

export function toIsoDate(value: string) {
    const iso = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
    const date = new Date(iso);

    return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function escapeXml(value: string) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");
}
