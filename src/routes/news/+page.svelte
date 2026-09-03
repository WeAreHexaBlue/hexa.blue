<script lang="ts">
    import { resolve } from "$app/paths";
    import { m } from "$lib/paraglide/messages";
    import { formatDateTime } from "$lib";

    import sanitize from "sanitize-html";

    const { data } = $props();
</script>

<svelte:head>
    <title>{m["news.title"]()}</title>
</svelte:head>
<main>
    <h1 class="text-5xl font-extrabold">
        {m["nav.news"]()}
    </h1>

    {#if data.articles.length === 0}
        <section class="sect">
            <h1>{m["news.none"]()}</h1>
        </section>
    {:else}
        {#each data.articles as article (article.slug)}
            <section class="sect news">
                <span>
                    <h1>{article.title}</h1>
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
                </span>
                <p>
                    {@html sanitize(
                        article.short ?? article.body,
                        {
                            allowedTags: ["b", "i", "u", "em", "strong", "a"],
                            allowedAttributes: {
                                "a": [ "href", "class" ]
                            }
                        }
                    )}
                </p>
                <a href={resolve("/news/[slug]", { slug: article.slug })} class="more">Read more...</a>
            </section>
        {/each}
    {/if}
</main>

<style lang="postcss">
    @reference "../../base.css";

    .sect.news {
        @apply gap-y-6 justify-items-center;

        span {
            @apply gap-y-2;
        }
    }
</style>