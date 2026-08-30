<script lang="ts">
    import { resolve } from "$app/paths";
    import { m } from "$lib/paraglide/messages";
    import { formatDateTime } from "$lib";

    import snarkdown from "snarkdown";
    import sanitize from "sanitize-html";

    const { data } = $props();
    const article = $derived(data.article);
</script>

<svelte:head>
    <title>{m["news.slug.title"]({ title: article.title })}</title>
</svelte:head>
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
            snarkdown(article.body),
            {
                allowedTags: ["b", "i", "u", "em", "strong", "a"],
                allowedAttributes: {
                    "a": [ "href", "class" ]
                }
            }
        )}
    </p>
    <a href={resolve("/news")} class="hover:gradtxt underline text-2xl">
        {m["news.slug.back"]()}
    </a>
</main>