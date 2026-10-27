<script lang="ts">
    import { resolve } from "$app/paths";
    import { m } from "$lib/paraglide/messages";
    import { DISCORD_URL, GITHUB_URL, localeHref } from "$lib";

    import { fade } from "svelte/transition";

    import DiscordEmbed from "$lib/components/discord-embed.svelte";

    import logo from "$lib/assets/main/hexablue.svg";
    import banner from "$lib/assets/main/banner.png";

    import dibsyLogo from "$lib/assets/projects/dibsy/dibsy.svg";
    import dibsyWordmark from "$lib/assets/projects/dibsy/dibsy_wordmark.svg";
    import seggsLogo from "$lib/assets/projects/seggs/seggs.svg";

    const heroCycle = [
        m["home.hero.cycle.open"](),
        m["home.hero.cycle.revol"](),
        m["home.hero.cycle.future"](),
        m["home.hero.cycle.foryou"]()
    ];
    let index = $state(0);

    $effect(() => {
        const interval = setInterval(() => {
            index = (index + 1) % heroCycle.length;
        }, 2000);

        return () => clearInterval(interval);
    });
</script>

<svelte:head>
    <title>{m["home.title"]()}</title>
</svelte:head>

<DiscordEmbed
    title={m.hexablue()}
    description={m["home.embed.description"]()}
    images={[banner]}
    primaryButton={{ label: m["embed.buttons.projects"](), url: localeHref(resolve("/projects")) }}
    buttons={[
        { label: m["embed.buttons.news"](), url: localeHref(resolve("/news")) },
        { label: m["embed.buttons.discord"](), url: DISCORD_URL },
        { label: m["embed.buttons.github"](), url: GITHUB_URL }
    ]}
/>

<main>
    <section class="intro">
        <div class="introbg">
            <img src={logo} id="biglogo" alt="HexaBlue Logo" />
        </div>
        <div class="herosect">
            <h1 class="hero">
                <span class="prefix">
                    <span class="gradtxt">{m.hexablue()}</span>
                    <span>{m["home.hero.is"]()}</span>
                </span>
                <span class="cycle" aria-live="polite">
                    <!-- The invisible words are rendered to consistently wrap text on small screens. -->
                    {#each heroCycle as word (word)}
                        <span class="pointer-events-none invisible select-none" aria-hidden="true">
                            {word}
                        </span>
                    {/each}

                    {#key index}
                        <span
                            class="gradtxt"
                            in:fade={{ duration: 300, delay: 300 }}
                            out:fade={{ duration: 300 }}>{heroCycle[index]}</span
                        >
                    {/key}
                </span>
            </h1>
            <p class="desc">
                {@html m["home.hero.desc"]()}
            </p>
        </div>
    </section>

    <section id="about" class="sect">
        <h2>
            <a href={localeHref(resolve("/#about"))}>{m["home.about.title"]()}</a>
        </h2>
        <p>{@html m["home.about.desc"]()}</p>
    </section>

    <section id="projects" class="sect">
        {#snippet moreProject(name: string)}
            <a href={localeHref(resolve(`/projects#${name}`))} class="hmore">
                {m["home.project_overview.more"]()}
            </a>
        {/snippet}

        <h2>
            <a href={localeHref(resolve("/#projects"))}>{m["home.project_overview.title"]()}</a>
        </h2>
        <span>
            <span class="projbrand">
                <img src={dibsyLogo} alt="dibsy Logo" />
                <img src={dibsyWordmark} alt="dibsy" />
            </span>
            <p>{@html m["home.project_overview.dibsy"]()}</p>
            {@render moreProject("dibsy")}
        </span>
        <span>
            <span class="projbrand">
                <img src={seggsLogo} alt="Server Eggs Logo" />
                <span class="font-gsans text-4xl font-extrabold">Server Eggs</span>
            </span>
            <p>{@html m["home.project_overview.seggs"]()}</p>
            {@render moreProject("eggs")}
        </span>
    </section>
</main>

<style lang="postcss">
    @reference "../base.css";

    .intro {
        @apply relative z-0 flex min-h-200 w-full flex-col justify-start;
        @apply -mt-62 pt-62 sm:-mt-44 sm:pt-44 md:-mt-40 md:pt-40;
    }

    .introbg {
        @apply absolute top-0 -z-50 h-200 w-full overflow-hidden;
        @apply bg-hbcol hbcol-angle-0 hbcol-dark-50%;
    }

    .herosect {
        @apply mt-44 px-6 xl:mt-60 xl:px-0;
        @apply flex flex-col items-center text-center;
        @apply xl:ml-30 xl:items-start xl:text-left;
    }

    .hero {
        @apply flex flex-col items-center justify-center gap-x-3 xl:flex-row xl:justify-start;
        @apply text-4xl leading-tight font-black sm:text-5xl md:text-6xl;
    }

    .hero .prefix {
        @apply flex flex-wrap justify-center gap-x-3 xl:justify-start;
    }

    .hero .cycle {
        @apply inline-grid xl:text-left;

        * {
            @apply col-start-1 row-start-1;
        }
    }

    .herosect .desc {
        @apply mt-2 max-w-2xl sm:text-xl xl:mt-0 xl:max-w-3xl;
        @apply mx-auto xl:mx-0;
    }

    #biglogo {
        @apply pointer-events-none absolute top-15 size-150 select-none sm:top-0;

        @apply left-1/2 -translate-x-1/2 translate-y-1/4;
        @apply opacity-60 xl:opacity-100;

        @apply xl:top-40 xl:right-40 xl:bottom-auto xl:left-auto;
        @apply xl:translate-x-0 xl:translate-y-0;
    }
</style>
