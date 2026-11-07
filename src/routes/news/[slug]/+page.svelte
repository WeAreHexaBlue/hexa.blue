<script lang="ts">
    import { resolve } from "$app/paths";
    import { m } from "$lib/paraglide/messages";
    import { baseLocale, localizeHref } from "$lib/paraglide/runtime";
    import { DISCORD_URL, formatDateTime } from "$lib";
    import { localizedHref } from "$lib/i18n";
    import { htmlToText, articleSanitizeOptions, firstImage } from "$lib/html";
    import { splitArticlePolls } from "$lib/polls";

    import PageHead from "$lib/components/page-head.svelte";
    import TagList from "$lib/components/tag-list.svelte";
    import PollCard from "$lib/components/poll.svelte";

    import sanitize from "sanitize-html";

    const { data } = $props();
    const article = $derived(data.article);
    const cover = $derived(firstImage(article.body));

    const bodyParts = $derived(splitArticlePolls(article.body));
    const pollByKey = $derived(new Map(data.polls.map((poll) => [poll.key, poll])));
    const unplacedPolls = $derived(
        data.polls.filter(
            (poll) => !bodyParts.some((part) => part.type === "poll" && part.key === poll.key)
        )
    );

    const description = $derived.by(() => {
        const text = htmlToText(article.short ?? article.body);
        const chars = Array.from(text);
        const shortened = chars.length > 280 ? chars.slice(0, 280).join("").trimEnd() + "…" : text;

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
    {description}
    type="article"
    {publishedTime}
    images={cover ? [cover.src] : []}
    imageAlt={cover?.alt || undefined}
    {canonical}
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
        url: resolve(localizedHref(`/news/${article.slug}`))
    }}
    buttons={[
        { label: m["embed.buttons.allnews"](), url: resolve(localizedHref("/news")) },
        { label: m["embed.buttons.discord"](), url: DISCORD_URL }
    ]}
/>

<main class="mb-8">
    <h1 class="text-5xl font-extrabold">{article.title}</h1>
    <sub>
        {@html sanitize(
            m["news.published"]({ author: article.author, ...formatDateTime(article.created_at) }),
            {
                allowedTags: ["b", "i"],
                allowedAttributes: {}
            }
        )}
    </sub>
    <TagList tags={article.tags} />
    <div class="article-content" lang={article.locale}>
        {#each bodyParts as part, index (index)}
            {#if part.type === "html"}
                <div class="article-body">
                    {@html sanitize(part.html, articleSanitizeOptions)}
                </div>
            {:else}
                {@const poll = pollByKey.get(part.key)}
                {#if poll}
                    <div class="article-poll">
                        <PollCard {poll} />
                    </div>
                {/if}
            {/if}
        {/each}
    </div>
    {#if unplacedPolls.length > 0}
        <section class="article-polls" aria-label={m["news.polls.title"]()}>
            <h2>{m["news.polls.title"]()}</h2>
            {#each unplacedPolls as poll (poll.id)}
                <PollCard {poll} />
            {/each}
        </section>
    {/if}
    <a href={resolve(localizedHref("/news"))} class="gobtn inline-block px-10 text-2xl">
        {m.back()}
    </a>
</main>

<style lang="postcss">
    @reference "../../../base.css";

    .article-polls {
        @apply mx-auto grid w-full max-w-2xl gap-4;
    }

    .article-polls h2 {
        @apply mt-4 text-3xl font-semibold;
    }

    .article-content {
        @apply inset-x-0 mx-auto my-8 max-w-prose;
    }

    .article-poll {
        @apply my-6;
    }

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
            @apply mr-auto ml-0;
        }

        :global(img.img-center) {
            @apply mx-auto;
        }

        :global(img.img-right) {
            @apply mr-0 ml-auto;
        }

        :global(figure) {
            @apply my-6;
        }

        :global(figcaption) {
            @apply mt-2 text-sm text-mist-300;
        }
    }
</style>
