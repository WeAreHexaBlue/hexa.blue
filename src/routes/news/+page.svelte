<script lang="ts">
    import { resolve } from "$app/paths";
    import { afterNavigate, goto } from "$app/navigation";
    import { m } from "$lib/paraglide/messages";
    import { formatDateTime } from "$lib";

    import DiscordEmbed from "$lib/components/discord-embed.svelte";
    import TagList from "$lib/components/tag-list.svelte";

    import sanitize from "sanitize-html";
    import { onDestroy } from "svelte";

    const { data } = $props();

    // svelte-ignore state_referenced_locally
    let query = $state(data.query);
    let timer: ReturnType<typeof setTimeout> | undefined;

    afterNavigate(() => {
        clearTimeout(timer);
        query = data.query;
    });

    onDestroy(() => clearTimeout(timer));

    function updateURL(value: string) {
        const term = value.trim();

        goto(
            term ? resolve(`/news?q=${encodeURIComponent(term)}`) : resolve("/news"),
            { replaceState: true, keepFocus: true, noScroll: true }
        );
    }

    function onInput(event: Event) {
        query = (event.currentTarget as HTMLInputElement).value;

        clearTimeout(timer);
        timer = setTimeout(() => updateURL(query), 250);
    }

    function onSubmit(event: SubmitEvent) {
        event.preventDefault();

        clearTimeout(timer);
        updateURL(query);
    }

    function onKeydown(event: KeyboardEvent) {
        if (event.key === "Escape" && query) {
            event.preventDefault();
            clearSearch();
        }
    }

    function clearSearch() {
        query = "";
        clearTimeout(timer);
        updateURL("");
    }
</script>

<svelte:head>
    <title>{m["news.title"]()}</title>
</svelte:head>

<DiscordEmbed
    title={m["news.title"]()}
    description={m["news.embed.description"]()}
    primaryButton={{ label: m["embed.buttons.news"](), url: resolve("/news") }}
/>

<main>
    <h1 class="text-5xl font-extrabold">
        {m["nav.news"]()}
    </h1>

    <section class="sect search">
        <form
            class="searchbar"
            method="GET"
            action={resolve("/news")}
            role="search"
            onsubmit={onSubmit}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
            </svg>
            <input
                type="search"
                name="q"
                value={query}
                oninput={onInput}
                onkeydown={onKeydown}
                placeholder={m["news.search.placeholder"]()}
                aria-label={m["news.search.label"]()}
                autocomplete="off"
                spellcheck="false"
                enterkeyhint="search"
            />
            {#if query}
                <button
                    type="button"
                    class="clear"
                    onclick={clearSearch}
                    aria-label={m["news.search.clear"]()}
                    title={m["news.search.clear"]()}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </button>
            {/if}
        </form>
    </section>

    {#if data.articles.length === 0}
        <section class="sect">
            <h1>
                {data.query
                    ? m["news.search.none"]({ query: data.query })
                    : m["news.none"]()}
            </h1>
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
                    <TagList tags={article.tags} />
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
                <button onclick={() => location.href = resolve("/news/[slug]", { slug: article.slug })} class="gobtn">
                    {m["news.more"]()}
                </button>
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

    .sect.search {
        @apply block py-4 px-4;
    }

    .searchbar {
        @apply flex w-full items-center gap-3;
        @apply rounded-2xl border border-mist-700 bg-mist-900 px-4 py-3;
        @apply transition-colors focus-within:border-mainblue;

        > svg {
            @apply size-5 shrink-0 text-mist-400;
        }

        input {
            @apply w-full min-w-0 bg-transparent text-lg text-white outline-none;
            @apply placeholder:text-mist-400;

            &::-webkit-search-cancel-button {
                @apply hidden;
            }
        }

        .clear {
            @apply grid size-8 shrink-0 place-items-center rounded-full text-mist-300;
            @apply transition-colors hover:bg-mist-700 hover:text-white;

            svg {
                @apply size-4;
            }
        }
    }
</style>