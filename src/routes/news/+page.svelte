<script lang="ts">
    import { resolve } from "$app/paths";
    import { m } from "$lib/paraglide/messages";

    import snarkdown from "snarkdown";
    import sanitizeHtml from "sanitize-html";

	import { getLocale } from "$lib/paraglide/runtime";

    const { data } = $props();

    function formatDateTime(dbstr: string) {
        const date = new Date(dbstr);
        const loc = getLocale();

        return {
            date: new Intl.DateTimeFormat(loc, { dateStyle: "long" }).format(date),
            time: new Intl.DateTimeFormat(loc, { timeStyle: "short" }).format(date)
        }
    }
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
                        {@html sanitizeHtml(
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
                    {@html sanitizeHtml(
                        snarkdown(article.short ?? article.body),
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