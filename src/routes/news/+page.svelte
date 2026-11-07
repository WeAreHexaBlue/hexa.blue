<script lang="ts">
    import { resolve } from "$app/paths";
    import { afterNavigate, goto } from "$app/navigation";
    import { m } from "$lib/paraglide/messages";
    import { localizedHref } from "$lib/i18n";
    import { formatDateTime } from "$lib";

    import PageHead from "$lib/components/page-head.svelte";
    import TagList from "$lib/components/tag-list.svelte";
    import PollCard from "$lib/components/poll.svelte";

    import sanitize from "sanitize-html";
    import { onDestroy } from "svelte";

    const { data } = $props();

    const isPolls = $derived(data.tab === "polls");
    const activePolls = $derived(data.polls.filter((poll) => !poll.finished));
    const finishedPolls = $derived(data.polls.filter((poll) => poll.finished));

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

        goto(resolve(localizedHref(term ? `/news?q=${encodeURIComponent(term)}` : "/news")), {
            replaceState: true,
            keepFocus: true,
            noScroll: true
        });
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
    {#if data.query}
        <meta name="robots" content="noindex, follow" />
    {/if}
</svelte:head>

<PageHead
    title={m["news.title"]()}
    description={m["news.embed.description"]()}
    alternateLocales={data.query ? [] : undefined}
    primaryButton={{ label: m["embed.buttons.news"](), url: resolve(localizedHref("/news")) }}
/>

<main>
    <h1 class="text-5xl font-extrabold">
        {m["nav.news"]()}
    </h1>

    <nav class="subtabs" aria-label={m["news.tabs.label"]()}>
        <a
            href={resolve(
                localizedHref(data.query ? `/news?q=${encodeURIComponent(data.query)}` : "/news")
            )}
            class={["chip", { active: !isPolls }]}
            aria-current={!isPolls ? "page" : undefined}
        >
            {m["news.tabs.articles"]()}
        </a>
        <a
            href={resolve(localizedHref("/news?tab=polls"))}
            class={["chip", { active: isPolls }]}
            aria-current={isPolls ? "page" : undefined}
        >
            {m["news.tabs.polls"]()}
            {#if data.polls.length > 0}
                <span class="count">{data.polls.length}</span>
            {/if}
        </a>
    </nav>

    {#if isPolls}
        {#if data.polls.length === 0}
            <section class="sect">
                <h2>{m["news.polls.none"]()}</h2>
            </section>
        {:else}
            <section class="sect polls-view">
                <div class="group">
                    <h2>{m["news.polls.activeTitle"]()}</h2>
                    {#if activePolls.length === 0}
                        <p class="empty">{m["news.polls.noneActive"]()}</p>
                    {:else}
                        <div class="poll-grid">
                            {#each activePolls as poll (poll.id)}
                                <div class="poll-cell">
                                    <PollCard {poll} showArticle />
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>

                <div class="group">
                    <h2>{m["news.polls.finishedTitle"]()}</h2>
                    {#if finishedPolls.length === 0}
                        <p class="empty">{m["news.polls.noneFinished"]()}</p>
                    {:else}
                        <div class="poll-grid">
                            {#each finishedPolls as poll (poll.id)}
                                <div class="poll-cell">
                                    <PollCard {poll} showArticle />
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            </section>
        {/if}
    {:else}
        <section class="sect search">
            <form
                class="searchbar"
                method="GET"
                action={resolve(localizedHref("/news"))}
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
                <h2>
                    {data.query ? m["news.search.none"]({ query: data.query }) : m["news.none"]()}
                </h2>
            </section>
        {:else}
            {#each data.articles as article (article.slug)}
                <section class="sect news">
                    <span>
                        <h2>
                            <a href={resolve(localizedHref(`/news/${article.slug}`))}
                                >{article.title}</a
                            >
                        </h2>
                        <sub>
                            {@html sanitize(
                                m["news.published"]({
                                    author: article.author,
                                    ...formatDateTime(article.created_at)
                                }),
                                {
                                    allowedTags: ["b", "i"],
                                    allowedAttributes: {}
                                }
                            )}
                        </sub>
                        <TagList tags={article.tags} />
                    </span>
                    <p>
                        {@html sanitize(article.short ?? article.body, {
                            allowedTags: ["b", "i", "u", "em", "strong", "a"],
                            allowedAttributes: {
                                a: ["href", "class"]
                            }
                        })}
                    </p>
                    <a
                        href={resolve(localizedHref(`/news/${article.slug}`))}
                        class="gobtn inline-block"
                    >
                        {m["news.more"]()}
                    </a>
                </section>
            {/each}
        {/if}
    {/if}
</main>

<style lang="postcss">
    @reference "../../base.css";

    .sect.news {
        @apply justify-items-center gap-y-6;

        span {
            @apply gap-y-2;
        }
    }

    .subtabs {
        @apply mt-6 flex flex-wrap justify-center gap-3;
    }

    .chip {
        @apply inline-flex items-center gap-2 rounded-full border border-mist-700 bg-mist-900 px-5 py-2 font-semibold text-mist-300;
        @apply transition-colors hover:border-mainblue hover:text-white;

        &.active {
            @apply border-mainblue bg-mainblue/25 text-white;
        }

        .count {
            @apply rounded-full bg-mist-700 px-2 py-0.5 text-xs font-bold text-white;
        }
    }

    .sect.polls-view {
        @apply mx-auto w-[calc(100%_-_2rem)] max-w-6xl grid-cols-1 gap-y-10 sm:w-[calc(100%_-_8rem)];

        .group {
            @apply grid w-full gap-4;
        }

        h2 {
            @apply text-3xl font-semibold;
        }

        .empty {
            @apply mx-auto text-center text-mist-300;
        }
    }

    .poll-grid {
        @apply flex w-full flex-wrap items-start justify-center gap-5;
    }

    .poll-cell {
        @apply w-full lg:w-[calc(50%_-_0.625rem)];
    }

    .sect.search {
        @apply block px-4 py-4;
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
