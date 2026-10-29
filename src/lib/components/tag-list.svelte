<script lang="ts">
    import { resolve } from "$app/paths";
    import { localizedHref } from "$lib/i18n";

    let { tags }: { tags: string[] } = $props();
</script>

{#if tags.length > 0}
    <ul class="tags">
        {#each tags as tag (tag)}
            <li>
                <a href={resolve(localizedHref(`/news?q=${encodeURIComponent(tag)}`))}>{tag}</a>
            </li>
        {/each}
    </ul>
{/if}

<style lang="postcss">
    @reference "../../base.css";

    ul.tags {
        @apply flex flex-wrap justify-center gap-2 mt-3;
    }

    li {
        @apply list-none;
    }

    a {
        @apply inline-block rounded-full border border-mainblue/60 bg-mainblue/20 px-3 py-1 text-sm font-semibold;
        @apply transition-colors hover:bg-mainblue/35;
        @apply focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mainblue;
    }
</style>