import { getLocale, localizeHref, type Locale } from "./paraglide/runtime";

/**
 * Applies the active locale's URL prefix to an app path.
 * Locale is carried by the URL, so every internal link must go through this.
 */
export function localeHref(path: string, locale?: Locale) {
    return localizeHref(path, locale ? { locale } : undefined);
}

export const DISCORD_URL = "https://discord.gg/DsARcGwwdM";
export const GITHUB_URL = "https://github.com/WeAreHexaBlue";
export const SEGGS_URL = "https://eggs.hexa.blue";

export const codeToHuman = {
    en: "English",
    it: "Italiano"
};

export function formatDateTime(dbstr: string) {
    const iso = dbstr.includes("T") ? dbstr : `${dbstr.replace(" ", "T")}Z`;
    const date = new Date(iso);
    const loc = getLocale();

    return {
        date: new Intl.DateTimeFormat(loc, { dateStyle: "long" }).format(date),
        time: new Intl.DateTimeFormat(loc, { timeStyle: "short", hour12: false }).format(date)
    }
}

export function parseTags(tags: string | null | undefined): string[] {
    if (!tags) return [];

    try {
        const parsed: unknown = JSON.parse(tags);

        return Array.isArray(parsed)
            ? parsed.filter((tag): tag is string => typeof tag === "string" && tag.length > 0)
            : [];
    } catch {
        return [];
    }
}