import { getLocale } from "./paraglide/runtime";

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