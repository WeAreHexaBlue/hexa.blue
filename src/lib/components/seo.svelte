<script lang="ts">
    import { page } from "$app/state";
    import { DISCORD_URL, GITHUB_URL } from "$lib";
    import {
        baseLocale,
        deLocalizeUrl,
        getLocale,
        locales,
        localizeHref,
        type Locale
    } from "$lib/paraglide/runtime";

    const OG_LOCALES: Record<Locale, string> = {
        en: "en_US",
        it: "it_IT"
    };

    const SITE_NAME = "HexaBlue";
    const SITE_DESCRIPTION =
        "HexaBlue builds free, open-source software that gives you control over your digital tools.";

    const origin = $derived(page.url.origin);
    const locale = $derived(getLocale());

    function normalize(path: string) {
        return path === "/" ? "/" : path.replace(/\/+$/, "");
    }

    function absolute(path: string) {
        return `${origin}${normalize(path)}`;
    }

    // The URL is the source of truth for the locale, so the canonical URL is the
    // current one and every translation is derived from the de-localized path.
    const basePath = $derived(normalize(deLocalizeUrl(page.url).pathname));
    const canonical = $derived(absolute(page.url.pathname));

    // Content that only exists in some locales (news articles) narrows the set.
    const available = $derived.by(() => {
        const declared = page.data.seo?.languages;
        if (!declared) return locales;

        const matching = locales.filter((locale) => declared.includes(locale));
        return matching.length > 0 ? matching : locales;
    });

    const alternates = $derived(
        available.map((entry) => ({
            locale: entry,
            href: absolute(localizeHref(basePath, { locale: entry }))
        }))
    );

    const defaultHref = $derived(
        absolute(
            localizeHref(basePath, {
                locale: available.includes(baseLocale) ? baseLocale : available[0]
            })
        )
    );

    const jsonLd = $derived(
        JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Organization",
                    "@id": `${origin}/#organization`,
                    name: SITE_NAME,
                    url: `${origin}/`,
                    logo: `${origin}/logo.svg`,
                    description: SITE_DESCRIPTION,
                    founder: { "@type": "Person", name: "Flamey" },
                    sameAs: [GITHUB_URL, DISCORD_URL, "https://bsky.app/profile/hexa.blue"]
                },
                {
                    "@type": "WebSite",
                    "@id": `${origin}/#website`,
                    name: SITE_NAME,
                    url: `${origin}/`,
                    inLanguage: locale,
                    publisher: { "@id": `${origin}/#organization` }
                }
            ]
        }).replaceAll("<", "\\u003c")
    );

    // Split so the Svelte parser does not treat this as the end of the script block.
    const jsonLdTag = $derived(`<script type="application/ld+json">${jsonLd}` + "</" + "script>");
</script>

<svelte:head>
    <link rel="canonical" href={canonical} />

    {#each alternates as alternate (alternate.locale)}
        <link rel="alternate" hreflang={alternate.locale} href={alternate.href} />
    {/each}
    <link rel="alternate" hreflang="x-default" href={defaultHref} />

    <meta property="og:locale" content={OG_LOCALES[locale]} />
    {#each alternates as alternate (alternate.locale)}
        {#if alternate.locale !== locale}
            <meta property="og:locale:alternate" content={OG_LOCALES[alternate.locale]} />
        {/if}
    {/each}

    {@html jsonLdTag}
</svelte:head>
