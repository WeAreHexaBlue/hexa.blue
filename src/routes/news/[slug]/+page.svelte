<script lang="ts">
    import { resolve } from "$app/paths";
    import { m } from "$lib/paraglide/messages";
    import { DISCORD_URL, formatDateTime } from "$lib";

    import DiscordEmbed from "$lib/components/discord-embed.svelte";

    import sanitize from "sanitize-html";

    const { data } = $props();
    const article = $derived(data.article);

    const sanitizeOptions = {
        allowedTags: ["b", "i", "u", "em", "strong", "a", "br", "code"],
        allowedAttributes: {
            "a": [ "href", "class" ]
        }
    };

    function plainText(html: string) {
        const spaced = html
            .replace(/<br\s*\/?>/gi, " ")
            .replace(/<\/(p|div|li|h[1-6]|blockquote)>/gi, " ");

        return sanitize(spaced, { allowedTags: [], allowedAttributes: {} })
            .replace(/&nbsp;/g, " ")
            .replace(/&#x([0-9a-f]+);/gi, (_match, code: string) =>
                String.fromCodePoint(parseInt(code, 16))
            )
            .replace(/&#(\d+);/g, (_match, code: string) => String.fromCodePoint(Number(code)))
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;|&apos;/g, "'")
            .replace(/&amp;/g, "&")
            .replace(/\s+/g, " ")
            .trim();
    }

    // Component embeds render markdown, so escape the characters of the article text.
    const description = $derived.by(() => {
        const text = plainText(article.short ?? article.body);
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