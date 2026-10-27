<script lang="ts">
    import { m } from "$lib/paraglide/messages";
    import { DISCORD_URL, GITHUB_URL } from "$lib";

    import DiscordEmbed from "$lib/components/discord-embed.svelte";
</script>

<svelte:head>
    <title>{m["contact.title"]()}</title>
</svelte:head>

<DiscordEmbed
    title={m["contact.title"]()}
    description={m["contact.embed.description"]()}
    buttons={[
        { label: m["embed.buttons.discord"](), url: DISCORD_URL },
        { label: m["embed.buttons.github"](), url: GITHUB_URL }
    ]}
/>

<main>
    <h1 class="text-5xl font-extrabold">
        {m["nav.contact"]()}
    </h1>

    <div class="sect spangrid lg:grid-cols-3">
        <a href="mailto:support@hexa.blue" target="_blank">
            <span>
                <h2>{m["contact.email"]()}</h2>
                <p class="hover:gradtxt underline">
                    support@hexa.blue
                </p>
            </span>
        </a>
        <a href="https://discord.gg/DsARcGwwdM" target="_blank">
            <span>
                <h2>{m["contact.discord"]()}</h2>
                <p class="hover:gradtxt underline">
                    discord.gg/DsARcGwwDM
                </p>
            </span>
        </a>
        <a href="https://github.com/WeAreHexaBlue" target="_blank">
            <span>
                <h2>{m["contact.github"]()}</h2>
                <p class="hover:gradtxt underline">
                    WeAreHexaBlue
                </p>
            </span>
        </a>
    </div>
</main>