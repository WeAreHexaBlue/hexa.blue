// place files you want to import through the `$lib` alias in this folder.

import { getLocale } from "./paraglide/runtime";

export function formatDateTime(dbstr: string) {
    const date = new Date(dbstr);
    const loc = getLocale();

    return {
        date: new Intl.DateTimeFormat(loc, { dateStyle: "long" }).format(date),
        time: new Intl.DateTimeFormat(loc, { timeStyle: "short" }).format(date)
    }
}