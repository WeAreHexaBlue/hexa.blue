<script lang="ts">
    import { page } from "$app/state";
    import { m } from "$lib/paraglide/messages";
    import { localizeHref } from "$lib/paraglide/runtime";

    type Props = {
        title: string;
        description: string;
        published: string;
        author: string;
        image?: string;
        tags?: string[];
    };

    let { title, description, published, author, image, tags = [] }: Props = $props();

    const origin = $derived(page.url.origin);
    const url = $derived(`${origin}${page.url.pathname}`);

    const jsonLd = $derived(
        JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Article",
                    headline: title,
                    description,
                    datePublished: published,
                    dateModified: published,
                    author: { "@type": "Person", name: author },
                    ...(image ? { image: [new URL(image, origin).href] } : {}),
                    ...(tags.length > 0 ? { keywords: tags.join(", ") } : {}),
                    mainEntityOfPage: { "@type": "WebPage", "@id": url },
                    isPartOf: { "@type": "WebSite", name: m.hexablue(), url: `${origin}/` }
                },
                {
                    "@type": "BreadcrumbList",
                    itemListElement: [
                        {
                            "@type": "ListItem",
                            position: 1,
                            name: m.hexablue(),
                            item: `${origin}${localizeHref("/")}`
                        },
                        {
                            "@type": "ListItem",
                            position: 2,
                            name: m["nav.news"](),
                            item: `${origin}${localizeHref("/news")}`
                        },
                        { "@type": "ListItem", position: 3, name: title }
                    ]
                }
            ]
        }).replaceAll("<", "\\u003c")
    );

    // Split so the Svelte parser does not treat this as the end of the script block.
    const jsonLdTag = $derived(
        `<script type="application/ld+json">${jsonLd}` + '</' + 'script>'
    );
</script>

<svelte:head>
    {@html jsonLdTag}
</svelte:head>
