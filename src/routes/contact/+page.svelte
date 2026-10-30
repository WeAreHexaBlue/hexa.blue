<script lang="ts">
    import { m } from "$lib/paraglide/messages";
    import { DISCORD_URL, GITHUB_URL } from "$lib";

    import PageHead from "$lib/components/page-head.svelte";
</script>

<svelte:head>
    <title>{m["contact.title"]()}</title>
</svelte:head>

<PageHead
    title={m["contact.title"]()}
    description={m["contact.embed.description"]()}
    buttons={[
        { label: m["embed.buttons.discord"](), url: DISCORD_URL },
        { label: m["embed.buttons.github"](), url: GITHUB_URL }
    ]}
/>

<main>
    <h1 class="text-5xl font-extrabold">
        {m["contact.header"]()}
    </h1>

    <div class="xl:mx-16 xl:grid xl:grid-cols-[minmax(0,1fr)_28rem] xl:items-start xl:gap-6 2xl:mx-auto 2xl:max-w-360">
        <div class="sect spangrid lg:grid-cols-3 xl:mx-0 xl:grid-cols-2 xl:content-start xl:self-stretch">
            <a href="mailto:support@hexa.blue" target="_blank">
                <span>
                    <h2>{m["contact.email"]()}</h2>
                    <p class="underline hover:gradtxt">support@hexa.blue</p>
                </span>
            </a>
            <a href="https://discord.gg/DsARcGwwdM" target="_blank">
                <span>
                    <h2>{m["contact.discord"]()}</h2>
                    <p class="underline hover:gradtxt">discord.gg/DsARcGwwDM</p>
                </span>
            </a>
            <a href="https://ko-fi.com/hexablue" target="_blank">
                <span>
                    <h2>{m["contact.kofi"]()}</h2>
                    <p class="underline hover:gradtxt">ko-fi.com/hexablue</p>
                </span>
            </a>
            <a href="https://github.com/WeAreHexaBlue" target="_blank">
                <span>
                    <h2>{m["contact.github"]()}</h2>
                    <p class="underline hover:gradtxt">WeAreHexaBlue</p>
                </span>
            </a>
            <a href="https://x.com/WeAreHexaBlue" target="_blank">
                <span>
                    <h2>{m["contact.twitter"]()}</h2>
                    <p class="underline hover:gradtxt">WeAreHexaBlue</p>
                </span>
            </a>
        </div>

        <div class="my-10 px-4 xl:px-0">
            <div class="mx-auto max-w-md overflow-hidden rounded-3xl bg-mist-800 p-2 sm:p-3">
                <iframe
                    id="kofiframe"
                    src="https://ko-fi.com/hexablue/?hidefeed=true&widget=true&embed=true"
                    title={m["contact.support"]()}
                    loading="lazy"
                    class="h-154 w-full rounded-4xl p-4"
                ></iframe>
            </div>
        </div>
    </div>
</main>