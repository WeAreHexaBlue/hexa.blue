<script lang="ts">
    import { resolve } from "$app/paths";
    import { page } from "$app/state";
    import { m } from "$lib/paraglide/messages";
    import { localizedHref } from "$lib/i18n";
    import { formatDateTime } from "$lib";
    import type { Poll } from "$lib/polls";

    let { poll, showArticle = false }: { poll: Poll; showArticle?: boolean } = $props();

    const voteAction = resolve(localizedHref("/news/polls/vote"));
    const redirect = $derived(`${page.url.pathname}${page.url.search}`);
    const showResults = $derived(poll.finished || poll.myOptionId !== null);

    function percent(votes: number): number {
        if (poll.totalVotes === 0) return 0;

        return Math.round((votes / poll.totalVotes) * 100);
    }
</script>

<section class="poll" id={`poll-${poll.id}`} aria-labelledby={`poll-${poll.id}-question`}>
    <header>
        <h3 id={`poll-${poll.id}-question`}>{poll.question}</h3>
        <span class={["status", { finished: poll.finished }]}>
            {poll.finished ? m["news.polls.finished"]() : m["news.polls.active"]()}
        </span>
    </header>

    {#if showArticle && poll.article}
        <p class="source">
            {m["news.polls.from"]()}
            <a href={resolve(localizedHref(`/news/${poll.article.slug}`))}>
                {poll.article.title}
            </a>
        </p>
    {/if}

    {#if showResults}
        <ul class="results">
            {#each poll.options as option (option.id)}
                <li class={{ chosen: option.id === poll.myOptionId }}>
                    <span class="label">
                        {option.label}
                        {#if option.id === poll.myOptionId}
                            <span class="yourvote">{m["news.polls.yourVote"]()}</span>
                        {/if}
                    </span>
                    <span class="bar" aria-hidden="true">
                        <span class="fill" style:width={`${percent(option.votes)}%`}></span>
                    </span>
                    <span class="count">
                        {m["news.polls.votes"]({
                            count: option.votes,
                            percent: percent(option.votes)
                        })}
                    </span>
                </li>
            {/each}
        </ul>
        <p class="total">{m["news.polls.total"]({ count: poll.totalVotes })}</p>
    {:else}
        <form method="POST" action={voteAction}>
            <input type="hidden" name="poll" value={poll.id} />
            <input type="hidden" name="redirect" value={redirect} />
            <fieldset>
                <legend class="sr-only">{poll.question}</legend>
                {#each poll.options as option (option.id)}
                    <button type="submit" name="option" value={option.id}>{option.label}</button>
                {/each}
            </fieldset>
        </form>
    {/if}

    {#if poll.endsAt}
        <p class="ends">
            {poll.finished
                ? m["news.polls.ended"](formatDateTime(poll.endsAt))
                : m["news.polls.ends"](formatDateTime(poll.endsAt))}
        </p>
    {/if}
</section>

<style lang="postcss">
    @reference "../../base.css";

    .poll {
        @apply grid min-w-0 gap-4 rounded-2xl border border-mist-700 bg-mist-900 p-5 text-left;
        @apply w-full content-start break-words;
    }

    header {
        @apply flex items-start justify-between gap-4;
    }

    h3 {
        @apply min-w-0 text-xl leading-snug font-semibold;
    }

    .status {
        @apply shrink-0 rounded-full border border-mainblue/60 bg-mainblue/20 px-3 py-1 text-xs font-bold tracking-wide uppercase;
    }

    .status.finished {
        @apply border-mist-600 bg-mist-800 text-mist-300;
    }

    .source {
        @apply text-sm text-mist-300;
        max-width: none;

        a {
            @apply font-semibold text-white underline hover:gradtxt;
        }
    }

    form,
    fieldset {
        @apply grid gap-2;
    }

    fieldset {
        @apply min-w-0 border-0 p-0;
    }

    form button {
        @apply w-full rounded-xl border border-mist-700 bg-mist-800 px-4 py-2.5 text-left font-semibold;
        @apply cursor-pointer transition-colors hover:border-mainblue hover:bg-mainblue/20;
    }

    .results {
        @apply grid gap-3;
        @apply m-0 p-0;
    }

    .results li {
        @apply grid list-none gap-1;
    }

    .results .label {
        @apply flex flex-wrap items-baseline gap-2 text-sm font-semibold;
    }

    .results .chosen .label {
        @apply text-white;
    }

    .yourvote {
        @apply rounded-full bg-mainblue/30 px-2 py-0.5 text-xs font-bold tracking-wide uppercase;
    }

    .bar {
        @apply block h-2.5 w-full overflow-hidden rounded-full bg-mist-700;
    }

    .bar .fill {
        @apply block h-full rounded-full bg-hbcol transition-[width] duration-500 hbcol-angle-45;
    }

    .count {
        @apply text-xs text-mist-300;
    }

    .total,
    .ends {
        @apply text-xs text-mist-300;
        max-width: none;
    }
</style>
