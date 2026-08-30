<script lang="ts">
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
    
</main>