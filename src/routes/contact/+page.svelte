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

    <div class="sect contact">
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

<style lang="postcss">
    @reference "../../base.css";

    .sect.contact {
        @apply grid md:grid-cols-3 gap-x-6 justify-stretch;

        span {
            @apply bg-mist-900 px-6 py-10 rounded-2xl;
            @apply justify-center items-center;

            @apply transition-transform duration-300 hover:scale-105 hover:drop-shadow-lg;
        }
    }
</style>