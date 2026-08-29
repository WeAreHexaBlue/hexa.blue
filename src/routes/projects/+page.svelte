<script lang="ts">
    import { resolve } from "$app/paths";
    import { m } from "$lib/paraglide/messages";

    import dibsyLogo from "$lib/assets/dibsy.svg";
    import dibsyWordmark from "$lib/assets/dibsy_wordmark.svg"

    import seggsLogo from "$lib/assets/seggs.svg";
</script>

<svelte:head>
    <title>{m["projects.title"]()}</title>
</svelte:head>
<main>
    <h1 class="text-5xl font-extrabold">
        {m["nav.projects"]()}
    </h1>
    
    <section id="dibsy" class="sect proj">
        <img src={dibsyLogo} class="logo" alt="dibsy Logo" />
        <span>
            <img src={dibsyWordmark} class="h-16" alt="dibsy" />
            <p>{@html m["projects.dibsy.desc"]()}</p>
            <a href={resolve("/projects#dibsy")} class="more">
                {m["projects.dibsy.soon"]()}
            </a>
        </span>
    </section>

    <section id="eggs" class="sect proj">
        <img src={seggsLogo} class="logo" alt="Server Eggs Logo" />
        <span>
            <h1 class="seggs">Server Eggs</h1>
            <p>{@html m["projects.seggs.desc"]()}</p>
            <span class="more">
                <a href="https://discord.gg/G9vfEZGZnT" target="_blank" class="more">
                    {m["projects.seggs.join"]()}
                </a>
                <a href="https://discord.com/oauth2/authorize?client_id=886686500845138041" target="_blank" class="more">
                    {m["projects.seggs.add"]()}
                </a>
            </span>
        </span>
    </section>
</main>