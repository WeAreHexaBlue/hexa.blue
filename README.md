# hexa.blue

The official HexaBlue website. Not yet in production.

## Translations

UI strings live in `messages/<locale>.json`, using BCP-47 tags (`en.json`, `it.json`, `pt-BR.json`, ...).

Adding a locale only requires adding that file. `bun run locales:sync` (also run automatically by `bun run dev`, `bun run build`, and `bun run check`) updates `project.inlang/settings.json`, and Paraglide then handles the routes, language switcher entry, `hreflang`, Open Graph locale, and sitemap for it. Untranslated strings fall back to English.

Do not edit the `locales` array in `project.inlang/settings.json` by hand, and do not let Prettier reformat `messages/`; Weblate owns those files once it is connected.
