<script lang="ts">
    import { resolve } from "$app/paths";
    import { m } from "$lib/paraglide/messages";
    import { baseLocale, localizeHref } from "$lib/paraglide/runtime";
    import { DISCORD_URL, formatDateTime } from "$lib";
    import { htmlToText, articleSanitizeOptions, firstImage } from "$lib/html";

    import PageHead from "$lib/components/page-head.svelte";
    import TagList from "$lib/components/tag-list.svelte";

    import sanitize from "sanitize-html";

    const { data } = $props();
    const article = $derived(data.article);
    const cover = $derived(firstImage(article.body));

    const description = $derived.by(() => {
        const text = htmlToText(article.short ?? article.body);
        const chars = Array.from(text);
        const shortened =
            chars.length > 280 ? chars.slice(0, 280).join("").trimEnd() + "…" : text;

        return shortened
            .replace(/([\\*_~`|])/g, "\\$1")
            .replace(/\[/g, "\\[")
            .replace(/\]/g, "\\]")
            .replace(/^([#>])/, "\\$1");
    });

    const publishedTime = $derived(
        article.created_at.includes("T")
            ? article.created_at
            : `${article.created_at.replace(" ", "T")}Z`
    );

    // Fallback articles are English content shown inside a localized page.
    const canonical = $derived(
        data.usedBase ? localizeHref(`/news/${article.slug}`, { locale: baseLocale }) : undefined
    );
</script>

<svelte:head>
    <title>{m["news.slug.title"]({ title: article.title })}</title>
</svelte:head>

<PageHead
    title={article.title}
    description={description}
    type="article"
    publishedTime={publishedTime}
    images={cover ? [cover.src] : []}
    imageAlt={cover?.alt || undefined}
    canonical={canonical}
    alternateLocales={data.locales}
    contentLocale={article.locale}
    author={article.author}
    keywords={article.tags}
    breadcrumbs={[
        { name: m.hexablue(), url: "/" },
        { name: m["nav.news"](), url: "/news" },
        { name: article.title, url: `/news/${article.slug}` }
    ]}
    primaryButton={{
        label: m["embed.buttons.read"](),
        url: resolve("/news/[slug]", { slug: article.slug })
    }}
    buttons={[
        { label: m["embed.buttons.allnews"](), url: resolve("/news") },
        { label: m["embed.buttons.discord"](), url: DISCORD_URL }
    ]}
/>

<main class="mb-8">
    <h1 class="text-5xl font-extrabold">{article.title}</h1>
    <sub>
        {@html sanitize(
            m["news.published"](
                { author: article.author, ...formatDateTime(article.created_at) }
            ), {
                allowedTags: ["b", "i"],
                allowedAttributes: {}
            }
        )}
    </sub>
    <TagList tags={article.tags} />
    <div class="article-body mx-auto my-8 inset-x-0 max-w-prose" lang={article.locale}>
        {@html sanitize(
            article.body,
            articleSanitizeOptions
        )}
    </div>
    <a href={resolve("/news")} class="gobtn inline-block px-10 text-2xl">
        {m.back()}
    </a>
</main>

<style lang="postcss">
    @reference "../../../base.css";

    .article-body {
        :global(p) {
            @apply my-4;
        }

        :global(img) {
            @apply mx-auto my-6 h-auto max-w-full rounded-2xl;
        }

        :global(img.img-tiny) {
            max-width: min(10rem, 100%);
        }

        :global(img.img-small) {
            max-width: min(20rem, 100%);
        }

        :global(img.img-medium) {
            max-width: min(28rem, 100%);
        }

        :global(img.img-large) {
            max-width: min(42rem, 100%);
        }

        :global(img.img-full) {
            @apply w-full max-w-none;
        }

        :global(img.img-left) {
            @apply ml-0 mr-auto;
        }

        :global(img.img-center) {
            @apply mx-auto;
        }

        :global(img.img-right) {
            @apply ml-auto mr-0;
        }

        :global(figure) {
            @apply my-6;
        }

        :global(figcaption) {
            @apply mt-2 text-sm text-mist-300;
        }
    }
</style>