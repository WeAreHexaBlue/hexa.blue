<script lang="ts">
    import { m } from "$lib/paraglide/messages";
</script>

<svelte:head>
    <title>{m["news.title"]()}</title>
</svelte:head>
<main>
    <h1 class="text-5xl font-extrabold">
        {m["nav.news"]()}
    </h1>

    <section class="sect">
        <h1>{m.placeholder()}</h1>
    </section>
</main>