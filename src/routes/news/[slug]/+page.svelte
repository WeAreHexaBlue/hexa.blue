<script lang="ts">
    import { resolve } from "$app/paths";
    import { m } from "$lib/paraglide/messages";
    import { DISCORD_URL, formatDateTime } from "$lib";
    import { htmlToText } from "$lib/html";

    import DiscordEmbed from "$lib/components/discord-embed.svelte";
    import TagList from "$lib/components/tag-list.svelte";

    import sanitize from "sanitize-html";

    const { data } = $props();
    const article = $derived(data.article);

    const sanitizeOptions = {
        allowedTags: ["b", "i", "u", "em", "strong", "a", "br", "code"],
        allowedAttributes: {
            "a": [ "href", "class" ]
        }
    };

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
</script>

<svelte:head>
    <title>{m["news.slug.title"]({ title: article.title })}</title>
</svelte:head>

<DiscordEmbed
    title={article.title}
    description={description}
    type="article"
    publishedTime={publishedTime}
    primaryButton={{
        label: m["embed.buttons.read"](),
        url: resolve("/news/[slug]", { slug: article.slug })
    }}
    buttons={[
        { label: m["embed.buttons.allnews"](), url: resolve("/news") },
        { label: m["embed.buttons.discord"](), url: DISCORD_URL }
    ]}
/>

<main>
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
    <p class="mx-auto my-8 inset-x-0 max-w-prose">
        {@html sanitize(
            article.body,
            sanitizeOptions
        )}
    </p>
    <a href={resolve("/news")} class="hover:gradtxt underline text-2xl">
        {m.back()}
    </a>
</main>