<script lang="ts">
    import { page } from "$app/state";
    import { m } from "$lib/paraglide/messages";
    import { GITHUB_URL } from "$lib";
    import { ogLocale } from "$lib/i18n";
    import {
        baseLocale,
        deLocalizeHref,
        getLocale,
        localizeHref,
        locales,
        type Locale
    } from "$lib/paraglide/runtime";

    type EmbedButton = {
        label: string;
        url: string;
    };

    type Breadcrumb = {
        name: string;
        url: string;
    };

    type Props = {
        title: string;
        description: string;
        images?: string[];
        image?: string;
        imageAlt?: string;
        buttons?: EmbedButton[];
        primaryButton?: EmbedButton;
        siteName?: string;
        accentColor?: number;
        type?: "website" | "article";
        publishedTime?: string;
        author?: string;
        keywords?: string[];
        breadcrumbs?: Breadcrumb[];
        schemas?: Record<string, unknown>[];
        canonical?: string;
        alternateLocales?: string[];
        contentLocale?: string;
    };

    let {
        title,
        description,
        images = [],
        image,
        imageAlt,
        buttons = [],
        primaryButton,
        siteName = "HexaBlue",
        accentColor = 0x006eff,
        type = "website",
        publishedTime,
        author,
        keywords = [],
        breadcrumbs = [],
        schemas = [],
        canonical,
        alternateLocales = [...locales],
        contentLocale
    }: Props = $props();

    const absoluteUrl = (value: string) => new URL(value, page.url.origin).href;

    function normalizePath(path: string) {
        return path.length > 1 ? path.replace(/\/+$/, "") : path;
    }

    const pageUrl = $derived(absoluteUrl(page.url.pathname));
    const canonicalPath = $derived(normalizePath(canonical ?? page.url.pathname));
    const canonicalUrl = $derived(absoluteUrl(canonicalPath));

    const currentLocale = getLocale();
    const contentLang = $derived(contentLocale ?? currentLocale);
    const currentOgLocale = $derived(ogLocale(contentLang));

    // Only locales that actually have a translated page belong in hreflang.
    const alternates = $derived.by(() => {
        if (alternateLocales.length < 2) return [];

        const path = deLocalizeHref(canonicalPath);

        return alternateLocales.map((locale) => ({
            locale,
            href: absoluteUrl(normalizePath(localizeHref(path, { locale: locale as Locale })))
        }));
    });

    const xDefault = $derived(
        alternates.find((alternate) => alternate.locale === baseLocale)?.href
    );

    const alternateOgLocales = $derived(
        alternates
            .filter((alternate) => alternate.locale !== contentLang)
            .map((alternate) => ogLocale(alternate.locale))
    );

    // Open Graph descriptions are plain text, while component embeds render markdown.
    const plainDescription = $derived(
        description
            .replace(/\\(.)/g, "$1")
            .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
            .replace(/\*\*([^*]+)\*\*/g, "$1")
            .replace(/__([^_]+)__/g, "$1")
            .replace(/~~([^~]+)~~/g, "$1")
            .replace(/\*([^*]+)\*/g, "$1")
            .replace(/_([^_]+)_/g, "$1")
            .replace(/`([^`]+)`/g, "$1")
            .replace(/\s+/g, " ")
            .trim()
    );

    const metaDescription = $derived.by(() => {
        if (plainDescription.length <= 160) return plainDescription;

        const truncated = plainDescription.slice(0, 157);
        const lastSpace = truncated.lastIndexOf(" ");
        const clean = lastSpace > 120 ? truncated.slice(0, lastSpace) : truncated;

        return `${clean.trimEnd()}…`;
    });

    // Discord renders this payload instead of the standard Open Graph card.
    // https://docs.discord.com/developers/link-previews/component-embeds
    const payload = $derived.by(() => {
        const gallery = images.map((url) => ({
            media: { url: absoluteUrl(url) },
            ...(imageAlt ? { description: imageAlt } : {})
        }));

        const linkText = title.replace(/\\/g, "\\\\").replace(/\[/g, "\\[").replace(/\]/g, "\\]");

        const content = `# [${linkText}](${pageUrl})\n${description}`;

        const components: Record<string, unknown>[] = [
            primaryButton
                ? {
                      type: 9,
                      components: [{ type: 10, content }],
                      accessory: {
                          type: 2,
                          style: 5,
                          url: absoluteUrl(primaryButton.url),
                          label: primaryButton.label
                      }
                  }
                : { type: 10, content }
        ];

        if (gallery.length > 0) {
            components.push({ type: 12, items: gallery });
        }

        if (buttons.length > 0) {
            components.push({
                type: 1,
                components: buttons.map((button) => ({
                    type: 2,
                    style: 5,
                    url: absoluteUrl(button.url),
                    label: button.label
                }))
            });
        }

        return {
            component: {
                type: 17,
                accent_color: accentColor,
                components
            }
        };
    });

    // Escaping "<" keeps the JSON from closing the script element.
    const payloadJson = $derived(JSON.stringify(payload).replaceAll("<", "\\u003c"));
    const closingTag = "</" + "script>";
    const embedTag = $derived(
        `<script id="discord:component-embed" type="application/json">${payloadJson}${closingTag}`
    );

    const fallbackImage = $derived(image ?? images[0]);
    const fallbackImageUrl = $derived(fallbackImage ? absoluteUrl(fallbackImage) : undefined);
    const themeColor = $derived(`#${accentColor.toString(16).padStart(6, "0")}`);

    const organizationId = `${page.url.origin}/#organization`;
    const websiteId = `${page.url.origin}/#website`;

    const structuredData = $derived.by(() => {
        const graph: Record<string, unknown>[] = [
            {
                "@type": "Organization",
                "@id": organizationId,
                name: "HexaBlue",
                url: page.url.origin,
                logo: absoluteUrl("/logo.svg"),
                email: "support@hexa.blue",
                sameAs: [GITHUB_URL]
            },
            {
                "@type": "WebSite",
                "@id": websiteId,
                name: siteName,
                url: page.url.origin,
                inLanguage: currentLocale,
                publisher: { "@id": organizationId }
            }
        ];

        if (type === "article") {
            graph.push({
                "@type": "Article",
                headline: title,
                description: plainDescription,
                datePublished: publishedTime,
                image: fallbackImageUrl ? [fallbackImageUrl] : undefined,
                author: author ? { "@type": "Person", name: author } : { "@id": organizationId },
                publisher: { "@id": organizationId },
                mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
                inLanguage: contentLang,
                keywords: keywords.length > 0 ? keywords.join(", ") : undefined
            });
        }

        if (breadcrumbs.length > 0) {
            graph.push({
                "@type": "BreadcrumbList",
                itemListElement: breadcrumbs.map(({ name, url }, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name,
                    item: absoluteUrl(normalizePath(localizeHref(url, { locale: currentLocale })))
                }))
            });
        }

        graph.push(...schemas);

        return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll(
            "<",
            "\\u003c"
        );
    });

    const structuredDataTag = $derived(
        `<script type="application/ld+json">${structuredData}${closingTag}`
    );
</script>

<svelte:head>
    <meta name="description" content={metaDescription} />

    <link rel="canonical" href={canonicalUrl} />
    <link
        rel="alternate"
        type="application/rss+xml"
        title={m["news.feed.title"]()}
        href={absoluteUrl(normalizePath(localizeHref("/news/rss.xml", { locale: currentLocale })))}
    />
    {#each alternates as alternate (alternate.locale)}
        <link rel="alternate" hreflang={alternate.locale} href={alternate.href} />
    {/each}
    {#if xDefault}
        <link rel="alternate" hreflang="x-default" href={xDefault} />
    {/if}

    <meta property="og:site_name" content={siteName} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={plainDescription} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:type" content={type} />
    <meta property="og:locale" content={currentOgLocale} />
    {#each alternateOgLocales as locale (locale)}
        <meta property="og:locale:alternate" content={locale} />
    {/each}
    {#if type === "article" && publishedTime}
        <meta property="article:published_time" content={publishedTime} />
    {/if}

    {#if fallbackImageUrl}
        <meta property="og:image" content={fallbackImageUrl} />
        <meta property="og:image:alt" content={imageAlt ?? title} />
    {/if}

    <meta name="theme-color" content={themeColor} />
    <meta name="twitter:card" content={fallbackImageUrl ? "summary_large_image" : "summary"} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={plainDescription} />
    {#if fallbackImageUrl}
        <meta name="twitter:image" content={fallbackImageUrl} />
        <meta name="twitter:image:alt" content={imageAlt ?? title} />
    {/if}

    {@html embedTag}
    {@html structuredDataTag}
</svelte:head>
