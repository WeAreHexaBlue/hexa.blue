<script lang="ts">
    import { m } from "$lib/paraglide/messages";
</script>

<svelte:head>
    <title>{m["contact.title"]()}</title>
</svelte:head>
<main>
    <h1 class="text-5xl font-extrabold">
        {m["nav.contact"]()}
    </h1>

    <div class="sect spangrid lg:grid-cols-3">
        <a href="mailto:support@hexa.blue" target="_blank">
            <span>
                <h1>{m["contact.email"]()}</h1>
                <p class="hover:gradtxt underline">
                    support@hexa.blue
                </p>
            </span>
        </a>
        <a href="https://discord.gg/DsARcGwwdM" target="_blank">
            <span>
                <h1>{m["contact.discord"]()}</h1>
                <p class="hover:gradtxt underline">
                    discord.gg/DsARcGwwDM
                </p>
            </span>
        </a>
        <a href="https://github.com/WeAreHexaBlue" target="_blank">
            <span>
                <h1>{m["contact.github"]()}</h1>
                <p class="hover:gradtxt underline">
                    WeAreHexaBlue
                </p>
            </span>
        </a>
    </div>
</main>