<script lang="ts">
    let { tags }: { tags: string[] } = $props();
</script>

{#if tags.length > 0}
    <ul class="tags">
        {#each tags as tag (tag)}
            <li>{tag}</li>
        {/each}
    </ul>
{/if}

<style lang="postcss">
    @reference "../../base.css";

    ul.tags {
        @apply flex flex-wrap justify-center gap-2 mt-3;
    }

    li {
        @apply list-none rounded-full border border-mainblue/60 bg-mainblue/20 px-3 py-1 text-sm font-semibold;
    }
</style>